import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivitySection from '../components/ActivitySection';

describe('ActivitySection', () => {
  it('renders the section title', () => {
    render(
      <ActivitySection title="Transport" color="amber" icon="Car" subtotal={1.2}>
        <p>children</p>
      </ActivitySection>
    );
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('renders the subtotal pill', () => {
    render(
      <ActivitySection title="Food" color="secondary" icon="Leaf" subtotal={0.75}>
        <p>children</p>
      </ActivitySection>
    );
    expect(screen.getByText('0.75 kg')).toBeInTheDocument();
  });

  it('renders children when expanded', () => {
    render(
      <ActivitySection title="Energy" color="sky" icon="Zap" subtotal={0.5}>
        <p>Test children content</p>
      </ActivitySection>
    );
    expect(screen.getByText('Test children content')).toBeInTheDocument();
  });

  it('collapses children when header is clicked', () => {
    render(
      <ActivitySection title="Shopping" color="coral" icon="ShoppingBag" subtotal={0}>
        <p>Collapsible child</p>
      </ActivitySection>
    );
    const header = screen.getByRole('button');
    fireEvent.click(header);
    expect(screen.queryByText('Collapsible child')).not.toBeInTheDocument();
  });

  it('re-expands after second click', () => {
    render(
      <ActivitySection title="Shopping" color="coral" icon="ShoppingBag" subtotal={0}>
        <p>Expandable child</p>
      </ActivitySection>
    );
    const header = screen.getByRole('button');
    fireEvent.click(header); // collapse
    fireEvent.click(header); // expand
    expect(screen.getByText('Expandable child')).toBeInTheDocument();
  });

  it('sets aria-expanded correctly', () => {
    render(
      <ActivitySection title="Transport" color="amber" icon="Car" subtotal={0}>
        <p>child</p>
      </ActivitySection>
    );
    const header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });
});
