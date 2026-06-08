/**
 * @fileoverview Root application component with routing layout.
 * @module App
 */

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Chat from './pages/Chat';

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
 * Defines routes for Dashboard, Log Activity, and Chat pages.
 * @returns {React.ReactElement} Application root
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogActivity />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
