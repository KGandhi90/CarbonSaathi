import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('renders the CarbonSaathi brand name', () => {
    renderNavbar();
    expect(screen.getByText('Carbon')).toBeInTheDocument();
    expect(screen.getByText('Saathi')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Log Activity')).toBeInTheDocument();
    expect(screen.getByText('AI Advisor')).toBeInTheDocument();
  });

  it('has accessible nav landmark', () => {
    renderNavbar();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('opens mobile menu when hamburger button is clicked', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(hamburger);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes mobile menu on second click', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(hamburger); // open
    fireEvent.click(hamburger); // close
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('updates aria-expanded on hamburger click', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Toggle navigation menu');
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });
});
