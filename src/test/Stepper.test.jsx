import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from '../components/Stepper';

describe('Stepper', () => {
  it('renders the current value', () => {
    render(
      <Stepper value={5} onChange={vi.fn()} min={0} max={10} label="Test stepper" />
    );
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('increments on + button click', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={5} onChange={onChange} min={0} max={10} label="Test stepper" />
    );
    fireEvent.click(screen.getByLabelText('Increase Test stepper'));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('decrements on - button click', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={5} onChange={onChange} min={0} max={10} label="Test stepper" />
    );
    fireEvent.click(screen.getByLabelText('Decrease Test stepper'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('does not go below min', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={0} onChange={onChange} min={0} max={10} label="Test stepper" />
    );
    fireEvent.click(screen.getByLabelText('Decrease Test stepper'));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('does not exceed max', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={10} onChange={onChange} min={0} max={10} label="Test stepper" />
    );
    fireEvent.click(screen.getByLabelText('Increase Test stepper'));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('sanitizes non-numeric direct input', () => {
    const onChange = vi.fn();
    render(
      <Stepper value={5} onChange={onChange} min={0} max={10} label="Test stepper" />
    );
    const input = screen.getByLabelText('Test stepper');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('renders unit when provided', () => {
    render(
      <Stepper
        value={5}
        onChange={vi.fn()}
        min={0}
        max={10}
        label="Test stepper"
        unit="km"
      />
    );
    expect(screen.getByText('km')).toBeInTheDocument();
  });
});
