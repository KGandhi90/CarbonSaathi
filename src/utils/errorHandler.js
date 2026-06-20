/**
 * @fileoverview Centralized error handling for async operations.
 * Provides a consistent wrapper that logs errors uniformly
 * and always returns a safe fallback value instead of throwing.
 * @module utils/errorHandler
 */

/**
 * Wraps an async function with consistent error handling.
 * On success, returns the function's result.
 * On failure, logs a warning and returns the provided fallback.
 * @param {Function} fn - Async function to execute
 * @param {string} context - Description for log messages (e.g. "saveActivityLog")
 * @param {*} fallback - Value to return if fn throws
 * @returns {Promise<*>} Result of fn or fallback on error
 */
export async function safeAsync(fn, context, fallback) {
  try {
    return await fn();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[${context}] failed:`, error.message);
    return fallback;
  }
}
