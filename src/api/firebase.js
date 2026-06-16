/**
 * @fileoverview Firebase integration — Firestore and Anonymous Auth.
 * All logs are scoped to the user's own UID under users/{uid}/activityLogs.
 * Zero personal data collected — users are identified only by Firebase UID.
 * @module api/firebase
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

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
 * Returns the Firestore collection path scoped to the current user's UID.
 * Path: users/{uid}/activityLogs
 * Each user can only access their own subcollection.
 * @returns {import('firebase/firestore').CollectionReference|null}
 */
function userLogsCollection() {
  if (!db || !auth?.currentUser) return null;
  return collection(db, 'users', auth.currentUser.uid, 'activityLogs');
}

/**
 * Returns today's date as an ISO date string (e.g. "2026-06-17").
 * Used as the Firestore document ID so only one log exists per day.
 * @returns {string} Date string in YYYY-MM-DD format
 */
function todayDateKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Saves (or overwrites) today's activity log in the user's subcollection.
 * Uses the date as the document ID (e.g. "2026-06-17") so that
 * logging a second time on the same day replaces the previous entry
 * instead of creating a duplicate.
 * @param {object} logEntry - Activity log data
 * @param {number} logEntry.transport - Transport emissions in kg CO₂
 * @param {number} logEntry.food - Food emissions in kg CO₂
 * @param {number} logEntry.energy - Energy emissions in kg CO₂
 * @param {number} logEntry.shopping - Shopping emissions in kg CO₂
 * @param {number} logEntry.total - Total emissions in kg CO₂
 * @returns {Promise<boolean>} True if saved successfully
 */
export async function saveActivityLog(logEntry) {
  if (!db) {
    // eslint-disable-next-line no-console
    console.warn('saveActivityLog: Firestore not initialized. Check VITE_FIREBASE_* env vars.');
    return false;
  }
  try {
    await ensureAuth();
    const col = userLogsCollection();
    if (!col) {
      // eslint-disable-next-line no-console
      console.warn('saveActivityLog: Auth not ready — could not get user UID.');
      return false;
    }
    const docRef = doc(col, todayDateKey());
    await setDoc(docRef, {
      ...logEntry,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('saveActivityLog failed — check Firestore rules:', err.code, err.message);
    return false;
  }
}

/**
 * Fetches the most recent 30 logs for the current user only.
 * Scoped to users/{uid}/activityLogs — other users cannot access this data.
 * All date filtering (today / weekly / monthly) is done client-side
 * to avoid requiring Firestore composite indexes.
 * @returns {Promise<Array<object>>} Array of the current user's log objects
 */
export async function getRecentLogs() {
  if (!db) return [];
  try {
    await ensureAuth();
    const col = userLogsCollection();
    if (!col) return [];
    const q = query(col, orderBy('timestamp', 'desc'), limit(30));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Log fetch failed:', err.code, err.message);
    return [];
  }
}
