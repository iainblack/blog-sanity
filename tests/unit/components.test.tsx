import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/healing-journey', useRouter: () => ({ push: vi.fn() }) }));
const { isEmailSubscribedAction, subscribeUserAction } = vi.hoisted(() => ({
  isEmailSubscribedAction: vi.fn(),
  subscribeUserAction: vi.fn(),
}));
vi.mock('@/app/api/actions', () => ({ isEmailSubscribedAction, subscribeUserAction }));

import Alert from '@/components/Alert';
import DateComponent from '@/components/DateComponent';
import PostFilters from '@/components/Post/PostFilters';
import PostPreviewGrid from '@/components/Post/PostPreviewGrid';
import SearchBar from '@/components/SearchBar';
import SignUpForm from '@/components/SignUpForm';
import Tabs from '@/components/Tabs';
import type { Post } from '@/sanity/lib/queries';

describe('SearchBar', () => {
  const setup = (props: Partial<React.ComponentProps<typeof SearchBar>> = {}) => {
    const handlers = { handleChange: vi.fn(), onSubmit: vi.fn() };
    render(<SearchBar value="" placeholder="Search books..." {...handlers} {...props} />);
    return { ...handlers, input: screen.getByPlaceholderText(props.placeholder ?? 'Search books...') };
  };

  it('reports typing', () => {
    const { input, handleChange } = setup();
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('submits on Enter only', () => {
    const { input, onSubmit } = setup();
    fireEvent.keyDown(input, { key: 'a' });
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders the optional submit button only when buttonText is given, and it submits', () => {
    const { onSubmit } = setup();
    expect(screen.queryByRole('button')).toBeNull();
    render(<SearchBar value="" handleChange={vi.fn()} onSubmit={onSubmit} buttonText="Sign Up" />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows an error message and swaps the button label for a spinner while loading', () => {
    render(<SearchBar value="" handleChange={vi.fn()} onSubmit={vi.fn()} buttonText="Go" error="Bad input" loading />);
    expect(screen.getByText('Bad input')).toBeInTheDocument();
    expect(screen.queryByText('Go')).toBeNull();
  });
});

describe('Alert', () => {
  it('renders nothing when hidden', () => {
    render(<Alert show={false} onClose={vi.fn()} message="Hi" type="success" />);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each([['success', 'bg-green-100'], ['error', 'bg-red-100']] as const)('%s alerts use their colour', (type, cls) => {
    render(<Alert show onClose={vi.fn()} message="Hi" type={type} />);
    expect(screen.getByRole('alert')).toHaveClass(cls);
    expect(screen.getByRole('alert')).toHaveTextContent('Hi');
  });

  it('closes after exactly 5 seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Alert show onClose={onClose} message="Hi" type="success" />);
    act(() => { vi.advanceTimersByTime(4999); });
    expect(onClose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not start a timer while hidden', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Alert show={false} onClose={onClose} message="Hi" type="success" />);
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('the close icon calls onClose', () => {
    const onClose = vi.fn();
    render(<Alert show onClose={onClose} message="Hi" type="error" />);
    fireEvent.click(screen.getByRole('alert').querySelector('svg')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Tabs', () => {
  const tabs = [
    { name: 'Books', resourceType: 'Books', icon: null },
    { name: 'Websites', resourceType: 'Websites', icon: null },
  ];
  it('highlights only the active tab and selects the clicked one', () => {
    const setActiveTab = vi.fn();
    render(<Tabs tabs={tabs} activeTab={tabs[0]} setActiveTab={setActiveTab} />);
    expect(screen.getByRole('button', { name: 'Books' })).toHaveClass('border-blue-600');
    expect(screen.getByRole('button', { name: 'Websites' })).not.toHaveClass('border-blue-600');
    fireEvent.click(screen.getByRole('button', { name: 'Websites' }));
    expect(setActiveTab).toHaveBeenCalledWith(tabs[1]);
  });
});

describe('PostFilters', () => {
  const setup = (order: string, view: 'grid' | 'list') => {
    const setOrder = vi.fn();
    const setView = vi.fn();
    render(<PostFilters order={order} setOrder={setOrder} view={view} setView={setView} loading={false} />);
    return { setOrder, setView };
  };

  it('labels the sort by the current order and offers the opposite', () => {
    setup('asc', 'grid');
    fireEvent.click(screen.getByRole('button', { name: 'Oldest First' }));
    expect(screen.getByText('Newest First')).toBeInTheDocument();
  });

  it.each([['asc', 'desc', 'Newest First'], ['desc', 'asc', 'Oldest First']])('from %s, choosing the option sets %s', (order, expected, option) => {
    const { setOrder } = setup(order, 'grid');
    fireEvent.click(screen.getByRole('button', { name: order === 'asc' ? 'Oldest First' : 'Newest First' }));
    fireEvent.click(screen.getByText(option));
    expect(setOrder).toHaveBeenCalledWith(expected);
  });

  it('view buttons expose which mode is active and switch mode', () => {
    const { setView } = setup('asc', 'list');
    expect(screen.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Grid view' }));
    expect(setView).toHaveBeenCalledWith('grid');
  });
});

describe('PostPreviewGrid', () => {
  const makePost = (n: number): Post => ({
    _id: `p${n}`, _createdAt: '2024-01-01T00:00:00Z', pageId: 'x', status: 'published', title: `Title ${n}`,
    slug: `slug-${n}`, excerpt: `Excerpt ${n}`, content: [], date: '2024-01-01T12:00:00.000Z', author: { name: 'Lou' },
  });
  const posts = (n: number) => Array.from({ length: n }, (_, i) => makePost(i + 1));
  const renderGrid = (props: Partial<React.ComponentProps<typeof PostPreviewGrid>>) =>
    render(<PostPreviewGrid posts={posts(4)} view="grid" page={0} loading={false} {...props} />);
  const hrefs = () => screen.getAllByRole('link').map((a) => a.getAttribute('href'));

  it('renders nothing while loading', () => {
    const { container } = renderGrid({ loading: true });
    expect(container).toBeEmptyDOMElement();
  });

  it.each([[undefined], [[]]])('empty/undefined posts (%j) show the default empty message', (value) => {
    renderGrid({ posts: value as Post[] | undefined });
    expect(screen.getByText('Nothing Yet Available')).toBeInTheDocument();
  });

  it('empty posts show a custom message when provided', () => {
    renderGrid({ posts: [], noResultsMessage: 'Coming later' });
    expect(screen.getByText('Coming later')).toBeInTheDocument();
    expect(screen.queryByText('Nothing Yet Available')).toBeNull();
  });

  it('first grid page: hero (with Read More) plus the rest; links point under the current path', () => {
    renderGrid({});
    expect(screen.getAllByText('Read More')).toHaveLength(1);
    expect(hrefs()).toEqual(['/healing-journey/posts/slug-1', '/healing-journey/posts/slug-2', '/healing-journey/posts/slug-3', '/healing-journey/posts/slug-4']);
  });

  it('a single post is just the hero', () => {
    renderGrid({ posts: posts(1) });
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getAllByText('Read More')).toHaveLength(1);
  });

  it('later grid pages have no hero', () => {
    renderGrid({ page: 1 });
    expect(screen.queryByText('Read More')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('list view never has a hero, on any page', () => {
    renderGrid({ view: 'list', page: 0 });
    expect(screen.queryByText('Read More')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('singleImage keeps the hero on page 0 but lists the rest compactly', () => {
    renderGrid({ singleImage: true });
    expect(screen.getAllByText('Read More')).toHaveLength(1);
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('omits author and excerpt lines when absent, without printing undefined', () => {
    const bare = { ...makePost(1), author: null, excerpt: undefined };
    renderGrid({ posts: [bare, { ...bare, _id: 'p2', slug: 's2', title: 'Bare 2' }], view: 'list' });
    expect(document.body.textContent).not.toMatch(/undefined|null/);
    expect(screen.queryByText('Lou')).toBeNull();
  });
});

describe('DateComponent', () => {
  it('renders a <time> with the machine-readable value and a long date', () => {
    render(<DateComponent dateString="2024-03-05T12:00:00.000Z" />);
    const time = document.querySelector('time')!;
    expect(time).toHaveAttribute('datetime', '2024-03-05T12:00:00.000Z');
    expect(time.textContent).toMatch(/March\s+5, 2024/);
  });

  // A date-only value is a calendar day: it must not shift in timezones behind UTC.
  it('shows the same calendar day for a date-only value in a timezone behind UTC', () => {
    const original = process.env.TZ;
    process.env.TZ = 'America/Los_Angeles';
    try {
      render(<DateComponent dateString="2024-01-01" />);
      expect(document.querySelector('time')!.textContent).toMatch(/January\s+1, 2024/);
    } finally {
      process.env.TZ = original;
    }
  });
});

describe('SignUpForm (footer)', () => {
  beforeEach(() => {
    isEmailSubscribedAction.mockReset().mockResolvedValue(false);
    subscribeUserAction.mockReset().mockResolvedValue(true);
  });
  const input = () => screen.getByPlaceholderText('Enter your email');
  const signUp = () => fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  // The modal stays mounted and is shown/hidden with CSS classes, so check the state, not presence.
  const modalOpen = () => document.getElementById('modal')!.className.includes('opacity-100');

  it('requires an email and does not call the server', () => {
    render(<SignUpForm />);
    signUp();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(isEmailSubscribedAction).not.toHaveBeenCalled();
  });

  it('rejects an email without @', () => {
    render(<SignUpForm />);
    fireEvent.change(input(), { target: { value: 'nope' } });
    signUp();
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(isEmailSubscribedAction).not.toHaveBeenCalled();
  });

  it('tells an already-subscribed visitor, and does not open the preferences modal', async () => {
    isEmailSubscribedAction.mockResolvedValue(true);
    render(<SignUpForm />);
    fireEvent.change(input(), { target: { value: 'a@example.com' } });
    signUp();
    expect(await screen.findByText('Email is already subscribed.')).toBeInTheDocument();
    expect(modalOpen()).toBe(false);
  });

  it('a new email opens the preferences modal with every section pre-selected; saving subscribes with them', async () => {
    render(<SignUpForm />);
    fireEvent.change(input(), { target: { value: 'a@example.com' } });
    signUp();
    await vi.waitFor(() => expect(modalOpen()).toBe(true));
    for (const section of ["Lou's Healing Journey", 'Additional Topics', 'Messages for Humanity']) {
      expect(screen.getByLabelText(section)).toBeChecked();
    }
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText('Successfully subscribed.')).toBeInTheDocument();
    expect(subscribeUserAction).toHaveBeenCalledWith('a@example.com', {
      "Lou's Healing Journey": true, 'Additional Topics': true, 'Messages for Humanity': true,
    });
    expect(input()).toHaveValue('');
    expect(modalOpen()).toBe(false);
  });

  it('shows a failure alert when subscribing fails', async () => {
    subscribeUserAction.mockResolvedValue(false);
    render(<SignUpForm />);
    fireEvent.change(input(), { target: { value: 'a@example.com' } });
    signUp();
    await vi.waitFor(() => expect(modalOpen()).toBe(true));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(await screen.findByText('Failed to subscribe. Please try again.')).toBeInTheDocument();
  });
});
