/**
 * @fileoverview AI Advisor chat page.
 * Shows conversation with CarbonSaathi AI assistant.
 * Uses mock replies; Gemini API wired in Phase 3.
 * @module pages/Chat
 */

import { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Leaf, SendHorizontal } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { useAppContext } from '../context/AppContext';
import { useChat } from '../hooks/useChat';

/**
 * Suggested quick reply questions for the chat.
 * @type {string[]}
 */
const QUICK_REPLIES = [
  'Best changes for Mumbai?',
  'Is an EV worth it in India?',
  'How does my diet impact carbon?',
  'What is carbon offsetting?',
  'How to reduce home energy use?',
  'Zomato vs cooking at home?',
  'How bad is air travel?',
  'India\'s carbon target?',
];

/**
 * Typing indicator dot indices for staggered animation.
 * @type {number[]}
 */
const TYPING_DOTS = [0, 1, 2];

/**
 * Chat page component — AI Advisor interface.
 * @returns {React.ReactElement} Rendered chat page
 */
function Chat() {
  const { chatSeedMessages, userProfile } = useAppContext();
  const {
    messages,
    input,
    isTyping,
    setInput,
    sendMessage,
    handleKeyDown,
  } = useChat(chatSeedMessages);

  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new messages or typing state change
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  /**
   * Handles input change for the textarea.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Change event
   */
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, [setInput]);

  /**
   * Auto-expands textarea height based on content.
   * @param {React.FormEvent<HTMLTextAreaElement>} e - Input event
   */
  const handleTextareaResize = useCallback((e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  /**
   * Handles quick reply chip click.
   * @param {string} text - Quick reply text
   */
  const handleQuickReply = useCallback((text) => {
    sendMessage(text);
  }, [sendMessage]);

  /** @type {boolean} Whether the send button should be disabled */
  const isSendDisabled = !input.trim();

  /** @type {boolean} Whether quick replies should be shown */
  const showQuickReplies = messages.length <= 2;

  return (
    <div className="page-enter flex flex-col" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      {/* Header Card */}
      <div
        className="bg-surface1 border border-surface3 rounded-2xl p-4 mb-4 shadow-card flex items-center gap-3"
        role="banner"
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl bg-green-gradient flex items-center justify-center text-lg flex-shrink-0"
          aria-hidden="true"
        >
          🌱
        </div>

        {/* Title */}
        <div className="flex-1">
          <h1 className="font-sans text-base font-semibold text-dark">
            CarbonSaathi AI
          </h1>
          <p className="font-sans text-xs text-muted mt-0.5">
            Your personal sustainability advisor
          </p>
        </div>

        {/* Online status */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-secondary pulse"
            aria-hidden="true"
          />
          <span className="text-xs text-secondary font-medium">
            Online
          </span>
        </div>
      </div>

      {/* Context Banner */}
      <div className="bg-accent/20 border border-accent/40 rounded-xl p-3 mb-4 flex gap-2 items-start">
        <Leaf
          className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="font-sans text-xs text-muted leading-relaxed">
          Based on your profile: Urban Indian · {userProfile.city} · Avg{' '}
          {userProfile.avgDaily} kg CO₂/day · Main source:{' '}
          {userProfile.mainSource} (33%)
        </p>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto no-scrollbar bg-surface1 border border-surface3 rounded-2xl p-4 mb-4 shadow-card flex flex-col gap-4 min-h-64"
        role="log"
        aria-label="Conversation with CarbonSaathi AI"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="self-start max-w-xs sm:max-w-sm flex items-start gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-green-gradient flex items-center justify-center text-base flex-shrink-0"
              aria-hidden="true"
            >
              🌱
            </div>
            <div className="bg-surface1 border border-surface3 rounded-2xl rounded-bl-none px-4 py-3 shadow-card">
              <span
                className="flex gap-1 items-center py-1"
                role="status"
                aria-label="CarbonSaathi AI is typing"
              >
                {TYPING_DOTS.map((index) => (
                  <span
                    key={index}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reply Chips */}
      <div
        className={`flex flex-wrap gap-2 mb-4 transition-opacity duration-300 ${
          showQuickReplies
            ? ''
            : 'opacity-0 pointer-events-none h-0 mb-0 overflow-hidden'
        }`}
        role="group"
        aria-label="Suggested questions"
      >
        {QUICK_REPLIES.map((question) => (
          <QuickReplyChip
            key={question}
            text={question}
            onClick={handleQuickReply}
          />
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-surface1 border border-surface3 rounded-2xl p-3 flex gap-3 items-end shadow-card">
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent outline-none text-sm text-dark placeholder-muted resize-none leading-relaxed font-sans"
          style={{ minHeight: '2.5rem', maxHeight: '8rem' }}
          aria-label="Message CarbonSaathi AI"
          aria-multiline="true"
          placeholder="Ask about reducing your carbon footprint..."
          rows={1}
          value={input}
          onChange={handleInputChange}
          onInput={handleTextareaResize}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={isSendDisabled}
          className={`w-10 h-10 rounded-xl flex-shrink-0 bg-primary flex items-center justify-center transition-colors duration-150 ${
            isSendDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary/90'
          }`}
          aria-label="Send message"
        >
          <SendHorizontal
            className="w-4 h-4 text-white"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

/**
 * Individual quick reply chip button.
 * Extracted to avoid inline functions in the parent JSX.
 * @param {object} props - Component props
 * @param {string} props.text - Chip label text
 * @param {Function} props.onClick - Click handler receiving text
 * @returns {React.ReactElement} Rendered chip button
 */
function QuickReplyChip({ text, onClick }) {
  const handleClick = useCallback(() => {
    onClick(text);
  }, [onClick, text]);

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={handleClick}
      className="bg-surface1 border border-surface3 hover:border-primary hover:bg-surface2 text-xs text-muted hover:text-dark rounded-xl px-3 py-2 cursor-pointer transition-all duration-150 font-medium font-sans"
    >
      {text}
    </button>
  );
}


QuickReplyChip.propTypes = {
  /** Chip label text */
  text: PropTypes.string.isRequired,
  /** Click handler receiving text */
  onClick: PropTypes.func.isRequired,
};

export default Chat;
