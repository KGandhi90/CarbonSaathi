import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from '../hooks/useChat';

// Mock Gemini API — return instant deterministic reply
vi.mock('../api/geminiApi', () => ({
  sendToGemini: vi.fn().mockResolvedValue('Mock AI reply'),
}));

const seedMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! How can I help?',
    timestamp: '10:00 AM',
  },
];

describe('useChat', () => {
  it('initializes with seed messages', () => {
    const { result } = renderHook(() => useChat(seedMessages));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello! How can I help?');
  });

  it('starts with empty input', () => {
    const { result } = renderHook(() => useChat(seedMessages));
    expect(result.current.input).toBe('');
  });

  it('starts with isTyping false', () => {
    const { result } = renderHook(() => useChat(seedMessages));
    expect(result.current.isTyping).toBe(false);
  });

  it('setInput updates input state', () => {
    const { result } = renderHook(() => useChat(seedMessages));
    act(() => {
      result.current.setInput('test message');
    });
    expect(result.current.input).toBe('test message');
  });

  it('sendMessage appends user message', async () => {
    const { result } = renderHook(() => useChat(seedMessages));
    await act(async () => {
      await result.current.sendMessage('What is carbon offsetting?');
    });
    await waitFor(() => {
      const userMsg = result.current.messages.find(
        (m) => m.content === 'What is carbon offsetting?'
      );
      expect(userMsg).toBeDefined();
    });
  });

  it('sendMessage appends AI reply after response', async () => {
    const { result } = renderHook(() => useChat(seedMessages));
    await act(async () => {
      await result.current.sendMessage('Help me reduce emissions');
    });
    await waitFor(() => {
      const aiMsg = result.current.messages.find(
        (m) => m.role === 'assistant' && m.content === 'Mock AI reply'
      );
      expect(aiMsg).toBeDefined();
    });
  });

  it('ignores empty sendMessage call', async () => {
    const { result } = renderHook(() => useChat(seedMessages));
    const before = result.current.messages.length;
    await act(async () => {
      await result.current.sendMessage('');
    });
    expect(result.current.messages).toHaveLength(before);
  });

  it('handleKeyDown sends on Enter without shift', async () => {
    const { result } = renderHook(() => useChat(seedMessages));
    act(() => {
      result.current.setInput('test');
    });
    await act(async () => {
      result.current.handleKeyDown({
        key: 'Enter',
        shiftKey: false,
        preventDefault: vi.fn(),
      });
    });
    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(1);
    });
  });
});
