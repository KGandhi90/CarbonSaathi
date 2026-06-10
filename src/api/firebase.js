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
