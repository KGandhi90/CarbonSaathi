import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import * as firebase from '../api/firebase';

// Build a mock log entry for today
function makeTodayLog() {
  const now = new Date();
  return {
    id: '2026-06-21',
    transport: 1.2,
    food: 0.8,
    energy: 0.5,
    shopping: 0.3,
    total: 2.8,
    // Firestore Timestamp-like object
    timestamp: {
      toDate: () => now,
    },
  };
}

const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

describe('useDashboard — empty state', () => {
  beforeEach(() => {
    vi.spyOn(firebase, 'getRecentLogs').mockResolvedValue([]);
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('resolves loading after data fetch', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('hasRealData is false when no logs', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.hasRealData).toBe(false);
    });
  });

  it('returns 4 categories in breakdown', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.categoryBreakdown).toHaveLength(4);
    });
  });

  it('returns 7 days of weekly chart data', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.weeklyChartData).toHaveLength(7);
    });
  });

  it('score is between 0 and 100', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.score).toBeGreaterThanOrEqual(0);
      expect(result.current.score).toBeLessThanOrEqual(100);
    });
  });
});

describe('useDashboard — with today log data', () => {
  beforeEach(() => {
    vi.spyOn(firebase, 'getRecentLogs').mockResolvedValue([makeTodayLog()]);
  });

  it('hasRealData is true when logs exist', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.hasRealData).toBe(true);
    });
  });

  it('todayTotal reflects logged data', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.todayTotal).toBeCloseTo(2.8, 1);
    });
  });

  it('categoryBreakdown has non-zero transport when logged', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      const transport = result.current.categoryBreakdown.find(
        (c) => c.id === 'transport'
      );
      expect(transport.value).toBeCloseTo(1.2, 1);
    });
  });

  it('weeklyTotal is at least todayTotal', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(result.current.weeklyTotal).toBeGreaterThanOrEqual(
        result.current.todayTotal
      );
    });
  });

  it('formattedToday is a string', async () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    await waitFor(() => {
      expect(typeof result.current.formattedToday).toBe('string');
    });
  });
});
