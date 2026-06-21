import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeeklyChart from '../components/WeeklyChart';

const mockData = [
  { day: 'Mon', value: 2.1, isToday: false },
  { day: 'Tue', value: 1.5, isToday: false },
  { day: 'Wed', value: 3.2, isToday: false },
  { day: 'Thu', value: 0.8, isToday: false },
  { day: 'Fri', value: 2.4, isToday: false },
  { day: 'Sat', value: 1.9, isToday: false },
  { day: 'Sun', value: 2.7, isToday: true },
];

describe('WeeklyChart', () => {
  it('renders all day labels', () => {
    render(<WeeklyChart data={mockData} />);
    mockData.forEach(({ day }) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('has accessible aria-label', () => {
    render(<WeeklyChart data={mockData} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Weekly carbon emissions bar chart'
    );
  });

  it('shows today value label when isToday is true', () => {
    render(<WeeklyChart data={mockData} />);
    // "2.7" is today's value, should appear as label
    expect(screen.getByText('2.7')).toBeInTheDocument();
  });

  it('renders with all-zero data without errors', () => {
    const zeroData = mockData.map((d) => ({ ...d, value: 0 }));
    const { container } = render(<WeeklyChart data={zeroData} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
