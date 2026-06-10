import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/StatusBadge';

describe('StatusBadge', () => {
  it('renders label text', () => {
    render(<StatusBadge label="Low Impact" variant="primary" />);
    expect(screen.getByText('Low Impact')).toBeInTheDocument();
  });

  it('renders all valid variants without error', () => {
    const variants = ['primary', 'secondary', 'coral', 'amber', 'sky', 'muted'];
    variants.forEach((variant) => {
      const { unmount } = render(<StatusBadge label="Test" variant={variant} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
      unmount();
    });
  });
});
