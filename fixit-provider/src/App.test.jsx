import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { FixitAsyncBoundary } from '../../shared/FixitAsyncBoundary.jsx';

async function renderApp() {
    render(<App />);
    await waitFor(() => expect(document.querySelector('.fixit-page-transition')).toBeInTheDocument());
}

const pageLabels = [
    'Dashboard',
    'My Profile',
    'My Services',
    'Availability',
    'Available Jobs',
    'Job Details',
    'My Jobs',
    'Earnings',
    'Reviews',
    'Settings',
];

afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', window.location.pathname);
});

describe('provider workspace navigation', () => {
    it('renders the provider dashboard by default', async () => {
        await renderApp();

        expect(screen.getByRole('heading', { name: /provider dashboard/i })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });

    it.each(pageLabels)('opens the %s screen and marks it active', async (page) => {
        await renderApp();

        fireEvent.click(screen.getByText(page, { selector: 'span' }));

        if (page === 'Dashboard') {
            expect(screen.getByRole('heading', { name: /provider dashboard/i })).toBeInTheDocument();
        } else {
            expect(await screen.findByRole('heading', { name: page, level: 1 })).toBeInTheDocument();
        }

        expect(screen.getByText(page, { selector: 'span' }).closest('button'))
            .toHaveAttribute('aria-current', 'page');
    });

    it('opens the mobile navigation and closes it after a section is selected', async () => {
        await renderApp();

        const menuButton = screen.getByLabelText(/open navigation menu/i);
        fireEvent.click(menuButton);

        expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByText('My Profile', { selector: 'span' }));

        expect(await screen.findByRole('heading', { name: 'My Profile', level: 1 })).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        expect(menuButton).toHaveFocus();
    });

    it('does not expose the removed Messages route', async () => {
        await renderApp();
        expect(screen.queryByRole('button', { name: 'Messages' })).not.toBeInTheDocument();
        window.history.replaceState({}, '', '#messages');
        fireEvent(window, new Event('hashchange'));
        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    });

    it('shows a not-found screen for an unknown hash route', async () => {
        await renderApp();

        window.history.replaceState({}, '', '#not-a-real-page');
        fireEvent(window, new Event('hashchange'));

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    });
});


describe('provider dashboard states and figures', () => {
    it('labels sample figures as demo data and separates estimated, agreed, and paid amounts', async () => {
        await renderApp();
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
        const DashboardPage = (await import('./DashboardPage.jsx')).default;
        render(<DashboardPage dataState="loading" />);
        expect(screen.getByRole('heading', { name: /loading your dashboard/i })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /earnings overview/i })).not.toBeInTheDocument();
    });

    it('shows a useful zero-data state and zero naira amounts', async () => {
        const DashboardPage = (await import('./DashboardPage.jsx')).default;
        render(<DashboardPage dataState="empty" />);
        expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
        expect(screen.getAllByText('₦0')).toHaveLength(3);
    });

    it('shows an error and exposes a retry action', async () => {
        const DashboardPage = (await import('./DashboardPage.jsx')).default;
        const onRetry = vi.fn();
        render(<DashboardPage dataState="error" onRetry={onRetry} />);
        expect(screen.getByRole('alert')).toHaveTextContent(/couldn’t load your dashboard/i);
        fireEvent.click(screen.getByRole('button', { name: /try again/i }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it('uses Nigerian naira currency formatting', async () => {
        const DashboardPage = (await import('./DashboardPage.jsx')).default;
        render(<DashboardPage dataState="empty" />);
        expect(screen.getAllByText('₦0')).toHaveLength(3);
    });
});


describe('provider job detail navigation', () => {
    it('opens the available sample job detail screen instead of a placeholder', async () => {
        await renderApp();
        fireEvent.click(screen.getByText('Job Details', { selector: 'span' }));

        expect(await screen.findByRole('heading', { name: 'Job Details', level: 1 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Repair leaking kitchen sink', level: 2 })).toBeInTheDocument();
        expect(screen.getByText(/sample job details/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Submit a quote' })).toBeInTheDocument();
    });

    it('traps keyboard focus and closes mobile navigation with Escape', async () => {
        await renderApp();
        const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
        fireEvent.click(menuButton);
        expect(screen.getByRole('dialog', { name: 'Provider navigation' })).toBeInTheDocument();
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog', { name: 'Provider navigation' })).not.toBeInTheDocument();
        expect(menuButton).toHaveFocus();
    });
});


describe('shared lazy-page failure state', () => {
    it('shows a recoverable error when a lazy page fails to render', () => {
        function BrokenPage() {
            throw new Error('simulated page chunk failure');
        }
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<FixitAsyncBoundary><BrokenPage /></FixitAsyncBoundary>);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'This page could not be opened' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reload app' })).toBeInTheDocument();
        consoleError.mockRestore();
    });
});
