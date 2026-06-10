/**
 * @fileoverview Manages chat state and AI responses.
 * Uses Gemini API with mock fallback.
 * @module hooks/useChat
 */

import { useState, useCallback } from 'react';
import { sendToGemini } from '../api/geminiApi';
import { trackEvent } from '../utils/analytics';

/**
 * Manages chat state and AI responses.
 * Uses Gemini API with mock reply fallback.
 * @param {Array<{ id: number, role: string, content: string, timestamp: string }>} seedMessages - Initial messages
 * @returns {object} Chat state, input, actions
 */
export function useChat(seedMessages) {
  const [messages, setMessages] = useState(() => [...seedMessages]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [apiHistory, setApiHistory] = useState([]);

  /**
   * Sends a user message and triggers Gemini AI reply.
   * Guards against receiving React events as overrideText.
   * @param {string} [overrideText] - Quick reply text (bypasses input state)
   */
  const sendMessage = useCallback(async (overrideText) => {
    // Guard: ignore React SyntheticEvent objects passed by onClick
    const text = (typeof overrideText === 'string' ? overrideText : input).trim();
    if (!text) return;

    setError(null);

    /** @type {{ id: number, role: string, content: string, timestamp: string }} */
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(
        [], { hour: '2-digit', minute: '2-digit' }
      ),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    trackEvent(
      'Chat',
      typeof overrideText === 'string' ? 'QuickReplyUsed' : 'MessageSent',
      typeof overrideText === 'string' ? overrideText : undefined
    );

    try {
      const reply = await sendToGemini(text, apiHistory);

      /** @type {{ id: number, role: string, content: string, timestamp: string }} */
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString(
          [], { hour: '2-digit', minute: '2-digit' }
        ),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Update history for multi-turn context
      setApiHistory((prev) => [
        ...prev,
        { role: 'user', content: text },
        { role: 'model', content: reply },
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Chat error:', err);
      setError('Having trouble connecting. Try again in a moment.');
    } finally {
      setIsTyping(false);
    }
  }, [input, apiHistory]);

  /**
   * Handles Enter key to send message.
   * Shift+Enter adds newline instead.
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - Keyboard event
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return {
    messages,
    input,
    isTyping,
    error,
    setInput,
    sendMessage,
    handleKeyDown,
  };
}
