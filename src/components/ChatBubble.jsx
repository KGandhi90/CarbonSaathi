/**
 * @fileoverview Chat message bubble component.
 * @module components/ChatBubble
 */

import PropTypes from 'prop-types';

/**
 * Chat message bubble component.
 * Renders differently for user vs assistant messages.
 * @param {object} props - Component props
 * @param {string} props.role - 'user' or 'assistant'
 * @param {string} props.content - Message text
 * @param {string} props.timestamp - Time string
 * @returns {React.ReactElement} Rendered chat bubble
 */
function ChatBubble({ role, content, timestamp }) {
  if (role === 'user') {
    return (
      <div className="flex flex-col items-end">
        <article
          role="article"
          aria-label="Your message"
          className="self-end max-w-xs sm:max-w-sm bg-green-gradient text-white rounded-2xl rounded-br-none px-4 py-3 text-sm leading-relaxed font-sans shadow-card"
        >
          {content}
        </article>
        <span className="text-xs text-muted mt-1 text-right">{timestamp}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <div className="self-start max-w-xs sm:max-w-sm flex items-start gap-2.5">
        {/* AI Avatar */}
        <div
          className="w-8 h-8 rounded-xl bg-green-gradient flex items-center justify-center text-base flex-shrink-0"
          aria-hidden="true"
        >
          🌱
        </div>

        {/* AI Bubble */}
        <article
          role="article"
          aria-label="CarbonSaathi AI response"
          className="bg-surface1 border border-surface3 rounded-2xl rounded-bl-none px-4 py-3 text-sm leading-relaxed text-dark font-sans shadow-card"
        >
          {content}
        </article>
      </div>
      <span className="text-xs text-muted mt-1 ml-10 text-left">{timestamp}</span>
    </div>
  );
}

ChatBubble.propTypes = {
  /** Message sender role */
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  /** Message text content */
  content: PropTypes.string.isRequired,
  /** Display timestamp */
  timestamp: PropTypes.string.isRequired,
};

export default ChatBubble;
