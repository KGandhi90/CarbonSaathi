import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScoreRing from '../components/ScoreRing';

describe('ScoreRing', () => {
  it('renders the score number', () => {
    render(<ScoreRing score={72} />);
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('has accessible aria-label with score', () => {
    render(<ScoreRing score={45} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Carbon score: 45 out of 100'
    );
  });

  it('renders /100 label', () => {
    render(<ScoreRing score={88} />);
    expect(screen.getByText('/100')).toBeInTheDocument();
  });

  it('accepts custom size prop without error', () => {
    const { container } = render(<ScoreRing score={50} size={120} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '120');
    expect(svg).toHaveAttribute('height', '120');
  });
});
