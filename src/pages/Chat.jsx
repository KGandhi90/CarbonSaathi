/**
 * @fileoverview AI Advisor chat page.
 * Shows conversation with CarbonSaathi AI assistant.
 * @module pages/Chat
 */

import { Leaf, SendHorizontal } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { chatSeedMessages, userProfile } from '../data/mockData';

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
 * No-op handler for send action.
 * Will be wired in Phase 3.
 */
const handleSend = () => {};

/**
 * No-op handler for quick reply selection.
 * Will be wired in Phase 3.
 */
const handleQuickReply = () => {};

/**
 * Chat page component — AI Advisor interface.
 * @returns {React.ReactElement} Rendered chat page
 */
function Chat() {
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
        className="flex-1 overflow-y-auto no-scrollbar bg-surface1 border border-surface3 rounded-2xl p-4 mb-4 shadow-card flex flex-col gap-4 min-h-64"
        role="log"
        aria-label="Conversation with CarbonSaathi AI"
        aria-live="polite"
        aria-relevant="additions"
      >
        {chatSeedMessages.map((message) => (
          <ChatBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
      </div>

      {/* Quick Reply Chips */}
      <div
        className="flex flex-wrap gap-2 mb-4"
        role="group"
        aria-label="Suggested questions"
      >
        {QUICK_REPLIES.map((question) => (
          <button
            key={question}
            type="button"
            tabIndex={0}
            onClick={handleQuickReply}
            className="bg-surface1 border border-surface3 hover:border-primary hover:bg-surface2 text-xs text-muted hover:text-dark rounded-xl px-3 py-2 cursor-pointer transition-all duration-150 font-medium font-sans"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-surface1 border border-surface3 rounded-2xl p-3 flex gap-3 items-end shadow-card">
        <textarea
          className="flex-1 bg-transparent outline-none text-sm text-dark placeholder-muted resize-none leading-relaxed font-sans"
          style={{ minHeight: '2.5rem', maxHeight: '8rem' }}
          aria-label="Message CarbonSaathi AI"
          aria-multiline="true"
          placeholder="Ask about reducing your carbon footprint..."
          rows={1}
        />
        <button
          type="button"
          onClick={handleSend}
          className="w-10 h-10 rounded-xl flex-shrink-0 bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors duration-150"
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

export default Chat;
