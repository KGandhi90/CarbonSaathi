import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTips } from '../hooks/useTips';

describe('useTips', () => {
  it('initializes all tips as not done', () => {
    const { result } = renderHook(() => useTips());
    expect(result.current.tips.every((t) => !t.done)).toBe(true);
  });

  it('completedCount starts at 0', () => {
    const { result } = renderHook(() => useTips());
    expect(result.current.completedCount).toBe(0);
  });

  it('marks a tip as done', () => {
    const { result } = renderHook(() => useTips());
    const firstId = result.current.tips[0].id;
    act(() => {
      result.current.completeTip(firstId);
    });
    const updated = result.current.tips.find((t) => t.id === firstId);
    expect(updated.done).toBe(true);
  });

  it('increments completedCount on completion', () => {
    const { result } = renderHook(() => useTips());
    const firstId = result.current.tips[0].id;
    act(() => {
      result.current.completeTip(firstId);
    });
    expect(result.current.completedCount).toBe(1);
  });

  it('accumulates totalSavings correctly', () => {
    const { result } = renderHook(() => useTips());
    const tip = result.current.tips[0];
    act(() => {
      result.current.completeTip(tip.id);
    });
    expect(result.current.totalSavings).toBeCloseTo(tip.saving, 1);
  });
});
