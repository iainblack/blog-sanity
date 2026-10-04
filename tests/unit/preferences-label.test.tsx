import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PreferencesForm from '@/components/PreferencesForm';
import post from '@/sanity/schemas/documents/post';

describe('PreferencesForm', () => {
  it('shows the display label but keeps the stored key as the checkbox name and toggle key', () => {
    const setPreferences = vi.fn();
    render(
      <PreferencesForm
        preferences={{ 'Additional Topics': true, 'Messages for Humanity': false }}
        setPreferences={setPreferences}
      />,
    );
    expect(screen.queryByText('Additional Topics')).not.toBeInTheDocument();
    const box = screen.getByLabelText('Metaphysical Spiritual Teachings');
    expect(box).toBeChecked();
    expect(box).toHaveAttribute('name', 'Additional Topics');

    fireEvent.click(box);
    expect(setPreferences).toHaveBeenCalledWith({ 'Additional Topics': false, 'Messages for Humanity': false });
  });

  it('shows sections without a label under their own name', () => {
    render(<PreferencesForm preferences={{ 'Messages for Humanity': true }} setPreferences={vi.fn()} />);
    expect(screen.getByLabelText('Messages for Humanity')).toBeChecked();
  });
});

describe('Sanity post "Page" dropdown', () => {
  const pageField = (post as any).fields.find((f: any) => f.name === 'pageId');

  it('shows the new label but saves the unchanged pageId', () => {
    expect(pageField.options.list).toContainEqual({ title: 'Metaphysical Spiritual Teachings', value: 'Additional Topics' });
  });

  it('offers exactly the three blog sections, each saving its own key', () => {
    expect(pageField.options.list.map((o: any) => o.value)).toEqual([
      "Lou's Healing Journey", 'Additional Topics', 'Messages for Humanity',
    ]);
  });
});
