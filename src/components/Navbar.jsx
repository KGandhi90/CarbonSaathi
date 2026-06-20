/**
 * @fileoverview Main navigation bar for CarbonSaathi.
 * Fixed top, full width, max-w-2xl centered.
 * @module components/Navbar
 */

import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

/**
 * Navigation link configuration.
 * @type {Array<{ to: string, label: string }>}
 */
const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/log', label: 'Log Activity' },
  { to: '/chat', label: 'AI Advisor' },
];

/**
 * Returns Tailwind class string for desktop NavLink.
 * @param {object} params - NavLink render props
 * @param {boolean} params.isActive - Whether the link is active
 * @returns {string} CSS class string
 */
function getDesktopLinkClass({ isActive }) {
  const base = 'text-sm font-medium transition-colors duration-150';
  return isActive
    ? `${base} text-primary border-b-2 border-primary pb-0.5`
    : `${base} text-muted hover:text-dark`;
}

/**
 * Returns Tailwind class string for mobile NavLink.
 * @param {object} params - NavLink render props
 * @param {boolean} params.isActive - Whether the link is active
 * @returns {string} CSS class string
 */
function getMobileLinkClass({ isActive }) {
  const base = 'py-2.5 px-3 rounded-xl text-sm font-medium';
  return isActive
    ? `${base} bg-surface2 text-primary`
    : `${base} text-muted hover:bg-surface2`;
}

/**
 * Main navigation bar for CarbonSaathi.
 * Renders the top navigation header with branding and links to main sections.
 * Features a responsive design with a hamburger menu for mobile devices.
 * @returns {React.ReactElement} Rendered navbar
 */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-surface1/90 backdrop-blur-md border-b border-surface3 shadow-card"
      aria-label="Main navigation"
    >
      {/* Inner container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Left — Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
          aria-label="CarbonSaathi home"
        >
          <Leaf className="w-5 h-5 text-primary" aria-hidden="true" />
          <span className="font-sans text-base font-semibold text-dark">
            Carbon<span className="text-primary">Saathi</span>
          </span>
        </NavLink>

        {/* Center — Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={getDesktopLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right — Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-surface2 transition-colors duration-150"
          onClick={handleToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-dark" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5 text-dark" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="menu"
          className="md:hidden bg-surface1 border-b border-surface3 px-4 py-3 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={getMobileLinkClass}
              role="menuitem"
              onClick={handleCloseMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
