import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

async function renderApp() {
    render(<App />);
    await waitFor(() => expect(document.querySelector('.fixit-page-transition')).toBeInTheDocument());
}

afterEach(() => {
    cleanup();
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
});

describe('customer application', () => {
    it('renders the home page and primary navigation', async () => {
        await renderApp();

        expect(screen.getByRole('heading', {
            name: 'Get your home fixed by people you can trust.',
        })).toBeInTheDocument();
        expect(screen.getByRole('navigation', {
            name: 'Primary navigation',
        })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /post a job/i })).toBeInTheDocument();
    });

    it('restores My Jobs when the page is opened or refreshed at its URL hash', async () => {
        window.history.replaceState(null, '', '#/my-jobs');

        await renderApp();

        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(window.location.hash).toBe('#/my-jobs');
    });

    it('updates the URL hash when navigating and supports browser back navigation', async () => {
        await renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));
        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(window.location.hash).toBe('#/my-jobs');

        fireEvent.click(screen.getByRole('button', { name: 'Post a New Job' }));
        expect(await screen.findByRole('heading', { name: /Post a New Job/i })).toBeInTheDocument();
        expect(window.location.hash).toBe('#/post-job');

        window.history.back();
        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
    });

    it('filters the sample provider list using the service search', async () => {
        await renderApp();

        const search = screen.getByRole('searchbox', { name: 'Search services' });
        fireEvent.change(search, { target: { value: 'Emeka Nwachukwu' } });

        expect(screen.getByText('Emeka Nwachukwu')).toBeInTheDocument();
        expect(screen.queryByText('Tunde Bello')).not.toBeInTheDocument();
    });

    it('opens the post-job screen from the primary action', async () => {
        await renderApp();

        fireEvent.click(screen.getByRole('button', { name: /post a job/i }));

        expect(await screen.findByRole('heading', { name: /post a new job/i })).toBeInTheDocument();
    });

    it('filters providers with a quick availability filter', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Available now' }));
        expect(screen.queryByText('Blessing Okafor')).not.toBeInTheDocument();
        expect(screen.getByText('Emeka Nwachukwu')).toBeInTheDocument();
    });

    it('opens My Jobs and filters requests using the redesigned controls', async () => {
        await renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));

        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        const search = screen.getByRole('searchbox', { name: 'Search jobs' });
        fireEvent.change(search, { target: { value: 'Circuit Breaker' } });

        expect(screen.getByRole('heading', { name: 'Circuit Breaker Tripping Frequently' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Fixing Kitchen Sink Leak' })).not.toBeInTheDocument();
    });

    it('does not expose in-app messaging in customer navigation or job actions', async () => {
        await renderApp();
        expect(screen.queryByRole('button', { name: 'Messages' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));
        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /chat with provider/i })).not.toBeInTheDocument();
        fireEvent.click(screen.getAllByRole('button', { name: /job details/i })[0]);
        expect(await screen.findByRole('heading', { name: 'Job Details' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /chat with provider/i })).not.toBeInTheDocument();
    });

    it('renders the customer profile settings without presenting demo wallet or verification claims as live data', async () => {
        await renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'Profile' }));

        expect(await screen.findByRole('heading', { name: 'Account & Profile Settings' })).toBeInTheDocument();
        expect(screen.getByText('Address management is not connected yet')).toBeInTheDocument();
        expect(screen.getByText('No payment methods available')).toBeInTheDocument();
        expect(screen.queryByText('₦45,000')).not.toBeInTheDocument();
        expect(screen.queryByText('Tier 2 Verified')).not.toBeInTheDocument();
    });

    it('allows a customer to edit and save their profile details in the current session', async () => {
        await renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
        expect(await screen.findByRole('heading', { name: 'Account & Profile Settings' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
        const nameInput = screen.getByRole('textbox', { name: 'Full name' });
        fireEvent.change(nameInput, { target: { value: 'Ada Customer' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

        expect(screen.getByRole('heading', { name: 'Ada Customer' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Your profile changes have been saved in this session.');
    });

    it('preserves My Jobs search, status, category, and sort when returning from Post a Job', async () => {
        await renderApp();

        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));
        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), {
            target: { value: 'Circuit Breaker' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Awaiting Bids/ }));
        fireEvent.change(screen.getByLabelText('Filter by category'), { target: { value: 'ELECTRICAL' } });
        fireEvent.change(screen.getByLabelText('Sort jobs'), { target: { value: 'price' } });

        fireEvent.click(screen.getByRole('button', { name: 'Post a New Job' }));
        expect(await screen.findByRole('heading', { name: /Post a New Job/i })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Go back' }));

        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(screen.getByRole('searchbox', { name: 'Search jobs' })).toHaveValue('Circuit Breaker');
        expect(screen.getByRole('button', { name: /Awaiting Bids/ })).toHaveClass('active');
        expect(screen.getByLabelText('Filter by category')).toHaveValue('ELECTRICAL');
        expect(screen.getByLabelText('Sort jobs')).toHaveValue('price');
        expect(document.querySelector('.my-jobs')).toHaveStyle({
            backgroundColor: 'rgb(246, 249, 247)',
        });
    });
});

describe('customer mobile filter sheet accessibility', () => {
    it('exposes the filter sheet as a dialog and closes it with Escape', async () => {
        const originalWidth = window.innerWidth;
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
        await renderApp();

        const trigger = document.querySelector('.marketplace-mobile-filter-button');
        expect(trigger).not.toBeNull();
        fireEvent.click(trigger);

        expect(screen.getByRole('dialog', { name: 'Detailed filters' })).toBeInTheDocument();
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('dialog', { name: 'Detailed filters' })).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    });
});
