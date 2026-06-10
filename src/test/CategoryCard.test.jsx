import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryCard from '../components/CategoryCard';

const mockCategory = {
  id: 'transport',
  label: 'Transport',
  value: 0.8,
  unit: 'kg CO₂',
  percent: 33,
  trend: 'up',
  color: 'amber',
  icon: 'Car',
};

describe('CategoryCard', () => {
  it('renders category label', () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('0.8')).toBeInTheDocument();
  });

  it('renders the unit', () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('kg CO₂')).toBeInTheDocument();
  });

  it('renders trend indicator for up', () => {
    render(<CategoryCard category={mockCategory} />);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('renders trend down correctly', () => {
    render(<CategoryCard category={{ ...mockCategory, trend: 'down' }} />);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('renders trend stable correctly', () => {
    render(<CategoryCard category={{ ...mockCategory, trend: 'stable' }} />);
    expect(screen.getByText('→')).toBeInTheDocument();
  });
});
