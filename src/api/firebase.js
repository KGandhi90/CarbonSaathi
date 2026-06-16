/**
 * @fileoverview Firebase integration — Firestore, Auth, App Check.
 * Stores activity logs anonymously. Zero personal data collected.
 * @module api/firebase
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

/**
 * Firebase configuration pulled from environment variables.
 * @type {object}
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** @type {object|undefined} Firebase app instance */
let app;
/** @type {object|undefined} Firestore instance */
let db;
/** @type {object|undefined} Firebase Auth instance */
let auth;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // App Check — reCAPTCHA v3
    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (recaptchaKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('Firebase init failed:', err);
}

/**
 * Ensures anonymous auth before Firestore operations.
 * Safe to call multiple times — no-ops if already signed in.
 * @returns {Promise<void>}
 */
async function ensureAuth() {
  if (!auth) return;
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Auth failed:', err);
  }
}

/**
 * Checks if a given date is today.
 * @param {Date} date - Date to check
 * @returns {boolean} True if the date is today
 */
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Saves a daily activity log to Firestore.
 * Stored anonymously — zero personal data.
 * @param {object} logEntry - Activity log data
 * @param {number} logEntry.transport - Transport emissions in kg CO₂
 * @param {number} logEntry.food - Food emissions in kg CO₂
 * @param {number} logEntry.energy - Energy emissions in kg CO₂
 * @param {number} logEntry.shopping - Shopping emissions in kg CO₂
 * @param {number} logEntry.total - Total emissions in kg CO₂
 * @returns {Promise<void>}
 */
export async function saveActivityLog(logEntry) {
  if (!db) return;
  try {
    await ensureAuth();
    await addDoc(collection(db, 'activityLogs'), {
      ...logEntry,
      timestamp: serverTimestamp(),
      city: 'Mumbai',
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Log save failed:', err);
  }
}

/**
 * Fetches recent activity logs for trend data.
 * Limited to last 30 entries for performance.
 * @returns {Promise<Array<object>>} Array of log objects
 */
export async function getRecentLogs() {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'activityLogs'),
      orderBy('timestamp', 'desc'),
      limit(30)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Log fetch failed:', err);
    return [];
  }
}

/**
 * Fetches today's most recent activity log from Firestore.
 * @returns {Promise<object|null>} Today's log or null if none exists
 */
export async function getTodayLog() {
  if (!db) return null;
  try {
    await ensureAuth();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { Timestamp } = await import('firebase/firestore');

    const q = query(
      collection(db, 'activityLogs'),
      where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('getTodayLog failed:', err);
    return null;
  }
}

/**
 * Fetches logs for the last 7 days from Firestore for the weekly chart.
 * Returns one entry per day (most recent log per day if multiple exist).
 * @returns {Promise<Array<object>>} Array of daily log summaries
 */
export async function getWeeklyLogs() {
  if (!db) return [];
  try {
    await ensureAuth();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { Timestamp } = await import('firebase/firestore');

    const q = query(
      collection(db, 'activityLogs'),
      where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);

    // Group by date — keep most recent per day
    const byDate = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      // Firestore Timestamp → JS Date
      const date = data.timestamp?.toDate
        ? data.timestamp.toDate()
        : new Date(data.timestamp);
      const dateKey = date
        .toLocaleDateString('en-IN', { weekday: 'short' })
        .slice(0, 3); // "Mon", "Tue" etc

      // Only keep most recent per day
      if (!byDate[dateKey]) {
        byDate[dateKey] = {
          day: dateKey,
          value: data.total || 0,
          isToday: isToday(date),
        };
      }
    });

    return Object.values(byDate);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('getWeeklyLogs failed:', err);
    return [];
  }
}

/**
 * Fetches this month's total CO₂ from Firestore.
 * @returns {Promise<number>} Monthly total in kg CO₂
 */
export async function getMonthlyTotal() {
  if (!db) return 0;
  try {
    await ensureAuth();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { Timestamp } = await import('firebase/firestore');

    const q = query(
      collection(db, 'activityLogs'),
      where('timestamp', '>=', Timestamp.fromDate(startOfMonth)),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().total || 0);
    }, 0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('getMonthlyTotal failed:', err);
    return 0;
  }
}
