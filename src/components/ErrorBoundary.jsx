/**
 * @fileoverview Error boundary component for graceful error handling.
 * Catches render errors and shows a user-friendly fallback UI.
 * @module components/ErrorBoundary
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { trackEvent } from '../utils/analytics';

/**
 * Error boundary component.
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 * @extends {Component}
 */
class ErrorBoundary extends Component {
  /**
   * @param {object} props - Component props
   * @param {React.ReactNode} props.children - Child components to wrap
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Derives error state from caught errors.
   * @returns {{ hasError: boolean }} Updated state
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * Logs error details and fires analytics event.
   * @param {Error} error - The caught error
   * @param {object} info - React error info with componentStack
   */
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.warn('CarbonSaathi render error:', error, info);
    trackEvent('App', 'RenderError', error.message);
  }

  /**
   * Renders children or fallback UI.
   * @returns {React.ReactNode} Children or error fallback
   */
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        role="alert"
        className="min-h-screen bg-base flex flex-col items-center justify-center p-8 text-center"
      >
        <span className="text-5xl mb-4" aria-hidden="true">
          🌱
        </span>
        <h1 className="font-display text-2xl font-bold text-dark mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-muted mb-8 max-w-sm font-sans">
          CarbonSaathi encountered an error. Please refresh to continue.
        </p>
        <button
          type="button"
          onClick={ErrorBoundary.handleRefresh}
          className="bg-primary text-white font-semibold text-sm rounded-2xl px-8 py-3 hover:bg-primary/90 transition-colors duration-150"
        >
          Refresh Page
        </button>
      </div>
    );
  }
}

/**
 * Refreshes the page on error recovery.
 */
ErrorBoundary.handleRefresh = () => {
  window.location.reload();
};

ErrorBoundary.propTypes = {
  /** Child components to wrap */
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
