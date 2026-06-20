import { describe, it, expect, vi } from 'vitest';
import { safeAsync } from '../utils/errorHandler';

describe('safeAsync', () => {
  it('returns the function result on success', async () => {
    const result = await safeAsync(async () => 'success', 'testContext', 'fallback');
    expect(result).toBe('success');
  });

  it('returns fallback on error', async () => {
    const result = await safeAsync(
      async () => {
        throw new Error('fail');
      },
      'testContext',
      'fallback'
    );
    expect(result).toBe('fallback');
  });

  it('does not throw even when wrapped fn throws', async () => {
    await expect(
      safeAsync(
        async () => {
          throw new Error('fail');
        },
        'testContext',
        null
      )
    ).resolves.not.toThrow();
  });

  it('logs a warning on error', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await safeAsync(
      async () => {
        throw new Error('fail');
      },
      'testContext',
      null
    );
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
