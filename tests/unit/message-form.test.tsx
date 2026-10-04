import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MessageForm from '@/components/MessageForm';

const VALID = { 'Your First Name': 'Ada', 'Your Last Name': 'Lovelace', Subject: 'Hello', 'Your Email': 'ada@example.com', Message: 'This message is long enough.' };
const ERRORS = ['First name is required', 'Last name is required', 'Subject is required', 'Email is required', 'Message is required'];

const fillAll = (values: Record<string, string>) => {
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
  }
};
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
const errorTexts = () => Array.from(document.querySelectorAll('form p.text-red-500')).map((el) => el.textContent);
const mockFetch = (ok: boolean) => {
  const fn = vi.fn(async () => ({ ok }) as Response);
  vi.stubGlobal('fetch', fn);
  return fn;
};

describe('MessageForm', () => {
  it('every input is associated with its label', () => {
    render(<MessageForm />);
    for (const label of Object.keys(VALID)) {
      expect(screen.getByLabelText(label, { exact: true })).toBeInTheDocument();
    }
  });

  it('shows all five required errors on an empty submit and never calls the API', () => {
    const fetchMock = mockFetch(true);
    render(<MessageForm />);
    submit();
    expect(errorTexts()).toEqual(ERRORS);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(Object.keys(VALID))('only that field errors when "%s" alone is empty', (label) => {
    const fetchMock = mockFetch(true);
    render(<MessageForm />);
    fillAll({ ...VALID, [label]: '' });
    submit();
    expect(errorTexts()).toHaveLength(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an email without @ and accepts one with', () => {
    const fetchMock = mockFetch(true);
    render(<MessageForm />);
    fillAll({ ...VALID, 'Your Email': 'nope' });
    submit();
    expect(errorTexts()).toEqual(['Invalid email']);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('message length boundary: 9 rejected, 10 accepted', async () => {
    const fetchMock = mockFetch(true);
    render(<MessageForm />);
    fillAll({ ...VALID, Message: '123456789' });
    submit();
    expect(errorTexts()).toEqual(['Message must be at least 10 characters']);
    expect(fetchMock).not.toHaveBeenCalled();

    fillAll({ Message: '1234567890' });
    submit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });

  it('POSTs the entered values as JSON to /api/sendEmail', async () => {
    const fetchMock = mockFetch(true);
    render(<MessageForm />);
    fillAll(VALID);
    submit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/sendEmail');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      senderEmail: 'ada@example.com', firstName: 'Ada', lastName: 'Lovelace', subject: 'Hello', message: 'This message is long enough.',
    });
  });

  it('success: shows the success alert and clears every field', async () => {
    mockFetch(true);
    render(<MessageForm />);
    fillAll(VALID);
    submit();
    expect(await screen.findByText('Message sent successfully')).toBeInTheDocument();
    for (const label of Object.keys(VALID)) {
      expect(screen.getByLabelText(label, { exact: true })).toHaveValue('');
    }
  });

  it('failure: shows the error alert and keeps the typed values', async () => {
    mockFetch(false);
    render(<MessageForm />);
    fillAll(VALID);
    submit();
    expect(await screen.findByText('Message failed to send')).toBeInTheDocument();
    expect(screen.getByLabelText('Message', { exact: true })).toHaveValue(VALID.Message);
  });

  it('typing into a field clears only that field\'s error', () => {
    render(<MessageForm />);
    submit();
    fireEvent.change(screen.getByLabelText('Subject', { exact: true }), { target: { value: 'x' } });
    expect(errorTexts()).toEqual(ERRORS.filter((e) => e !== 'Subject is required'));
  });

  it('a successful send after a failed validation leaves a clean form (no stale errors)', async () => {
    mockFetch(true);
    render(<MessageForm />);
    submit();
    expect(errorTexts()).toHaveLength(5);
    fillAll(VALID);
    submit();
    await screen.findByText('Message sent successfully');
    expect(errorTexts()).toEqual([]);
  });

  it('a network failure shows the error alert, stops the spinner and keeps the typed values', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));
    render(<MessageForm />);
    fillAll(VALID);
    submit();
    expect(await screen.findByText('Message failed to send')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByLabelText('Message', { exact: true })).toHaveValue(VALID.Message);
  });
});
