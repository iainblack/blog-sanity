import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Pagination from '@/components/Pagination';

const setup = (totalPages: number, active: number) => {
  const setActive = vi.fn();
  render(<Pagination totalPages={totalPages} active={active} setActive={setActive} />);
  return {
    setActive,
    prev: screen.getByRole('button', { name: 'Previous page' }),
    next: screen.getByRole('button', { name: 'Next page' }),
  };
};

describe('Pagination', () => {
  it('renders nothing when there are no pages', () => {
    const { container } = render(<Pagination totalPages={0} active={0} setActive={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  // The TESTING.md state table
  it.each([
    { totalPages: 1, active: 0, label: 'Page 1 of 1', prev: false, next: false },
    { totalPages: 5, active: 0, label: 'Page 1 of 5', prev: false, next: true },
    { totalPages: 5, active: 2, label: 'Page 3 of 5', prev: true, next: true },
    { totalPages: 5, active: 4, label: 'Page 5 of 5', prev: true, next: false },
    { totalPages: 2, active: 1, label: 'Page 2 of 2', prev: true, next: false },
  ])('page $label: prev enabled=$prev, next enabled=$next', ({ totalPages, active, label, prev, next }) => {
    const buttons = setup(totalPages, active);
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(buttons.prev).toHaveProperty('disabled', !prev);
    expect(buttons.next).toHaveProperty('disabled', !next);
  });

  it('disabled buttons are styled as disabled; enabled ones are not', () => {
    const { prev, next } = setup(3, 0);
    expect(prev).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(next).not.toHaveClass('opacity-50');
  });

  it('next/prev move exactly one page', () => {
    const { setActive, prev, next } = setup(5, 2);
    fireEvent.click(next);
    expect(setActive).toHaveBeenLastCalledWith(3);
    fireEvent.click(prev);
    expect(setActive).toHaveBeenLastCalledWith(1);
  });
});
