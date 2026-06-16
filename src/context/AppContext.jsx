/**
 * @fileoverview Global application context providing static configuration data.
 * Mutable state lives in individual page hooks.
 * weeklyData and todayBreakdown are now provided by useDashboard (real-time).
 * @module context/AppContext
 */

import { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  transportModes,
  foodTypes,
  shoppingTypes,
  chatSeedMessages,
  userProfile,
} from '../data/mockData';

/**
 * @typedef {Object} AppContextValue
 * @property {Array} transportModes - Transport mode options
 * @property {Array} foodTypes - Food type options
 * @property {Array} shoppingTypes - Shopping category options
 * @property {Array} chatSeedMessages - Initial chat messages
 * @property {Object} userProfile - User profile data
 */

/** @type {React.Context<AppContextValue|null>} */
const AppContext = createContext(null);

/**
 * Provides global static configuration data to the component tree.
 * Chart and emission data are now fetched live via useDashboard.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Context provider wrapper
 */
export function AppProvider({ children }) {
  const value = useMemo(() => ({
    transportModes,
    foodTypes,
    shoppingTypes,
    chatSeedMessages,
    userProfile,
  }), []);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  /** Child components to wrap */
  children: PropTypes.node.isRequired,
};

/**
 * Hook to consume the AppContext.
 * @returns {AppContextValue} Context value
 * @throws {Error} If used outside AppProvider
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
