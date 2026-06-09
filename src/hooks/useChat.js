/**
 * @fileoverview Manages chat state and AI responses.
 * Uses mock replies now, Gemini in Phase 3.
 * @module hooks/useChat
 */

import { useState, useCallback } from 'react';
import { getMockReply } from '../utils/helpers';
import { trackEvent } from '../utils/analytics';

/**
 * Manages chat state and AI responses.
 * Uses mock replies now, Gemini API in Phase 3.
 * @param {Array<{ id: number, role: string, content: string, timestamp: string }>} seedMessages - Initial messages
 * @returns {object} Chat state, input, actions
 */
export function useChat(seedMessages) {
  const [messages, setMessages] = useState(() => [...seedMessages]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sends a user message and triggers mock AI reply.
   * @param {string} [overrideText] - Quick reply text (bypasses input state)
   */
  const sendMessage = useCallback((overrideText) => {
    const text = (overrideText || input).trim();
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
      overrideText ? 'QuickReplyUsed' : 'MessageSent',
      overrideText || undefined
    );

    // Simulate API delay
    setTimeout(() => {
      /** @type {{ id: number, role: string, content: string, timestamp: string }} */
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getMockReply(text),
        timestamp: new Date().toLocaleTimeString(
          [], { hour: '2-digit', minute: '2-digit' }
        ),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  }, [input]);

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
