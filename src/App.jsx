/**
 * @fileoverview Root application component with routing, analytics, and context.
 * @module App
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Chat from './pages/Chat';
import { AppProvider } from './context/AppContext';
import { initAnalytics, trackPageView } from './utils/analytics';

/**
 * Route path to page title mapping.
 * @type {Record<string, string>}
 */
const PAGE_TITLES = {
  '/': 'Dashboard — CarbonSaathi',
  '/log': 'Log Activity — CarbonSaathi',
  '/chat': 'AI Advisor — CarbonSaathi',
};

/**
 * Tracks page views and updates document title on route changes.
 * @returns {null} Renders nothing
 */
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || 'CarbonSaathi';
    document.title = title;
    trackPageView(location.pathname, title);
  }, [location.pathname]);

  return null;
}

/**
 * Shared layout wrapper with skip link, navbar, and main content area.
 * @returns {React.ReactElement} Layout wrapper
 */
function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <PageTracker />
      <main
        id="main-content"
        className="max-w-2xl mx-auto w-full px-4 sm:px-6 pt-20 pb-28"
      >
        <Outlet />
      </main>
    </>
  );
}

/**
 * Root application component.
 * Initializes analytics and provides global context.
 * @returns {React.ReactElement} Application root
 */
function App() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<LogActivity />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
