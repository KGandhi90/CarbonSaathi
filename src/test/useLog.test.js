import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLog } from '../hooks/useLog';
import { transportModes, foodTypes, shoppingTypes } from '../data/mockData';

vi.mock('../api/firebase', () => ({
  saveActivityLog: vi.fn().mockResolvedValue(true),
}));

const mockCtx = {
  transportModes,
  foodTypes,
  shoppingTypes,
};

describe('useLog', () => {
  it('initializes with default transport mode', () => {
    const { result } = renderHook(() => useLog(mockCtx));
    expect(result.current.transportMode).toBe('metro');
  });

  it('updates transport CO2 when km changes', () => {
    const { result } = renderHook(() => useLog(mockCtx));
    act(() => {
      result.current.setTransportKm(20);
    });
    expect(result.current.transportCO2).toBeGreaterThan(0);
  });

  it('calculates total as sum of categories', () => {
    const { result } = renderHook(() => useLog(mockCtx));
    const expectedTotal =
      result.current.transportCO2 +
      result.current.foodCO2 +
      result.current.energyCO2 +
      result.current.shoppingCO2;
    expect(result.current.totalCO2).toBeCloseTo(expectedTotal, 1);
  });

  it('updates energy CO2 when renewable toggled', () => {
    const { result } = renderHook(() => useLog(mockCtx));
    const before = result.current.energyCO2;
    act(() => {
      result.current.setRenewable(true);
    });
    expect(result.current.energyCO2).toBeLessThanOrEqual(before);
  });

  it('shows save toast after saveLog', async () => {
    const { result } = renderHook(() => useLog(mockCtx));
    await act(async () => {
      await result.current.saveLog();
    });
    expect(result.current.saveToast).not.toBeNull();
  });

  it('sets isSaved true after saveLog', async () => {
    const { result } = renderHook(() => useLog(mockCtx));
    await act(async () => {
      await result.current.saveLog();
    });
    expect(result.current.isSaved).toBe(true);
  });
});
