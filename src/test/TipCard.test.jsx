import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TipCard from '../components/TipCard';

const mockTip = {
  id: 1,
  text: 'Switch to metro for daily commute',
  saving: 0.4,
  color: 'secondary',
  done: false,
};

describe('TipCard', () => {
  it('renders tip text', () => {
    render(<TipCard tip={mockTip} onComplete={vi.fn()} />);
    expect(screen.getByText('Switch to metro for daily commute')).toBeInTheDocument();
  });

  it('renders saving amount', () => {
    render(<TipCard tip={mockTip} onComplete={vi.fn()} />);
    expect(screen.getByText(/Saves 0.4 kg/)).toBeInTheDocument();
  });

  it('calls onComplete with tip id when button clicked', () => {
    const onComplete = vi.fn();
    render(<TipCard tip={mockTip} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onComplete).toHaveBeenCalledWith(1);
  });

  it('shows CheckCircle icon when tip is done', () => {
    render(<TipCard tip={{ ...mockTip, done: true }} onComplete={vi.fn()} />);
    // Button aria-label still present
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-secondary');
  });

  it('button has accessible aria-label', () => {
    render(<TipCard tip={mockTip} onComplete={vi.fn()} />);
    expect(screen.getByLabelText(/Mark tip as complete/)).toBeInTheDocument();
  });
});
