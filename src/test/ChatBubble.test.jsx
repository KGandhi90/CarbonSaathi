import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatBubble from '../components/ChatBubble';

describe('ChatBubble', () => {
  it('renders user message content', () => {
    render(
      <ChatBubble role="user" content="How do I reduce emissions?" timestamp="10:00 AM" />
    );
    expect(screen.getByText('How do I reduce emissions?')).toBeInTheDocument();
  });

  it('renders AI message content', () => {
    render(
      <ChatBubble role="assistant" content="Switch to metro rail!" timestamp="10:01 AM" />
    );
    expect(screen.getByText('Switch to metro rail!')).toBeInTheDocument();
  });

  it('renders timestamp', () => {
    render(
      <ChatBubble role="user" content="Hello" timestamp="10:24 AM" />
    );
    expect(screen.getByText('10:24 AM')).toBeInTheDocument();
  });

  it('renders AI avatar for assistant', () => {
    render(
      <ChatBubble role="assistant" content="Hello" timestamp="10:00 AM" />
    );
    expect(screen.getByText('🌱')).toBeInTheDocument();
  });
});
