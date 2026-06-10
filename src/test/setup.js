/**
 * @fileoverview Test setup — mocks for external services.
 * Loaded before all test files via vitest config.
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST');
vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-fb');
vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-proj');

vi.mock('react-ga4', () => ({
  default: {
    initialize: vi.fn(),
    send: vi.fn(),
    event: vi.fn(),
  },
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: vi.fn(() => ({
      startChat: vi.fn(() => ({
        sendMessage: vi.fn(async () => ({
          response: {
            text: () => 'Mocked Gemini response',
          },
        })),
      })),
    })),
  })),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(async () => ({})),
  getDocs: vi.fn(async () => ({ docs: [] })),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInAnonymously: vi.fn(async () => ({})),
}));

vi.mock('firebase/app-check', () => ({
  initializeAppCheck: vi.fn(),
  ReCaptchaV3Provider: vi.fn(),
}));
