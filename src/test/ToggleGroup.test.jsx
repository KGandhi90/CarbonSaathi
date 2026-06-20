import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleGroup } from '../components/ToggleGroup';

const mockOptions = [
  { id: 'a', label: 'Option A' },
  { id: 'b', label: 'Option B' },
  { id: 'c', label: 'Option C' },
];

describe('ToggleGroup', () => {
  it('renders all options', () => {
    render(
      <ToggleGroup
        options={mockOptions}
        selected="a"
        onChange={vi.fn()}
        activeColor="amber"
        ariaLabel="Test group"
      />
    );
    mockOptions.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    });
  });

  it('marks the selected option as checked', () => {
    render(
      <ToggleGroup
        options={mockOptions}
        selected="b"
        onChange={vi.fn()}
        activeColor="amber"
        ariaLabel="Test group"
      />
    );
    const selected = screen.getByText('Option B');
    expect(selected).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when option clicked', () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup
        options={mockOptions}
        selected="a"
        onChange={onChange}
        activeColor="amber"
        ariaLabel="Test group"
      />
    );
    fireEvent.click(screen.getByText('Option C'));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('has radiogroup role', () => {
    render(
      <ToggleGroup
        options={mockOptions}
        selected="a"
        onChange={vi.fn()}
        activeColor="amber"
        ariaLabel="Test group"
      />
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('navigates with arrow keys', () => {
    const onChange = vi.fn();
    render(
      <ToggleGroup
        options={mockOptions}
        selected="a"
        onChange={onChange}
        activeColor="amber"
        ariaLabel="Test group"
      />
    );
    const firstOption = screen.getByText('Option A');
    fireEvent.keyDown(firstOption, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
