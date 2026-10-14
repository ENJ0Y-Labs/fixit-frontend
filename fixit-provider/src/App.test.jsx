import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

const pageLabels = [
    'Dashboard',
    'My Profile',
    'My Services',
    'Availability',
    'Available Jobs',
    'Job Details',
    'My Jobs',
    'Messages',
    'Earnings',
    'Reviews',
    'Settings',
];

afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', window.location.pathname);
});

describe('provider workspace navigation', () => {
    it('renders the provider dashboard by default', () => {
        render(<App />);

        expect(screen.getByRole('heading', { name: /good morning, provider/i })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });

    it.each(pageLabels)('opens the %s screen and marks it active', (page) => {
        render(<App />);

        fireEvent.click(screen.getByText(page, { selector: 'span' }));

        if (page === 'Dashboard') {
            expect(screen.getByRole('heading', { name: /good morning, provider/i })).toBeInTheDocument();
        } else {
            expect(screen.getByRole('heading', { name: page, level: 1 })).toBeInTheDocument();
        }

        expect(screen.getByText(page, { selector: 'span' }).closest('button'))
            .toHaveAttribute('aria-current', 'page');
    });

    it('opens the mobile navigation and closes it after a section is selected', () => {
        render(<App />);

        const menuButton = screen.getByLabelText(/open navigation menu/i);
        fireEvent.click(menuButton);

        expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByText('My Profile', { selector: 'span' }));

        expect(screen.getByRole('heading', { name: 'My Profile', level: 1 })).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows a not-found screen for an unknown hash route', () => {
        render(<App />);

        window.history.replaceState({}, '', '#not-a-real-page');
        fireEvent(window, new Event('hashchange'));

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    });
});


describe('provider dashboard states and figures', () => {
    it('labels sample figures as demo data and separates estimated, agreed, and paid amounts', () => {
        render(<App />);
        expect(screen.getByText('Demo data')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Earnings overview' })).toBeInTheDocument();
        expect(screen.getByText('Estimated', { selector: 'span' })).toBeInTheDocument();
        expect(screen.getByText('Agreed', { selector: 'span' })).toBeInTheDocument();
        expect(screen.getByText('Paid', { selector: 'span' })).toBeInTheDocument();
        expect(screen.getByText('₦95,000')).toBeInTheDocument();
        expect(screen.getByText('₦180,000')).toBeInTheDocument();
        expect(screen.getByText('₦125,000')).toBeInTheDocument();
    });

    it('shows a loading state without displaying earnings as if they were loaded', async () => {
        const { Dashboard } = await import('./App.jsx');
        render(<Dashboard dataState="loading" />);
        expect(screen.getByRole('heading', { name: /loading your dashboard/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /earnings overview/i })).not.toBeInTheDocument();
    });

    it('shows a useful zero-data state and zero naira amounts', async () => {
        const { Dashboard } = await import('./App.jsx');
        render(<Dashboard dataState="empty" />);
        expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
        expect(screen.getAllByText('₦0')).toHaveLength(3);
    });

    it('shows an error and exposes a retry action', async () => {
        const { Dashboard } = await import('./App.jsx');
        const onRetry = vi.fn();
        render(<Dashboard dataState="error" onRetry={onRetry} />);
        expect(screen.getByRole('alert')).toHaveTextContent(/couldn’t load your dashboard/i);
        fireEvent.click(screen.getByRole('button', { name: /try again/i }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it('uses Nigerian naira currency formatting', async () => {
        const { Dashboard } = await import('./App.jsx');
        render(<Dashboard dataState="empty" />);
        expect(screen.getAllByText('₦0')).toHaveLength(3);
    });
});
