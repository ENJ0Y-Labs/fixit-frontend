import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

afterEach(() => {
    cleanup();
    it('renders the customer profile settings without presenting demo wallet or verification claims as live data', async () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: 'Profile' }));

        expect(await screen.findByRole('heading', { name: 'Account & Profile Settings' })).toBeInTheDocument();
        expect(screen.getByText('Address management is not connected yet')).toBeInTheDocument();
        expect(screen.getByText('No payment methods available')).toBeInTheDocument();
        expect(screen.queryByText('₦45,000')).not.toBeInTheDocument();
        expect(screen.queryByText('Tier 2 Verified')).not.toBeInTheDocument();
    });

    it('allows a customer to edit and save their profile details in the current session', async () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
        expect(await screen.findByRole('heading', { name: 'Account & Profile Settings' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
        const nameInput = screen.getByRole('textbox', { name: 'Full name' });
        fireEvent.change(nameInput, { target: { value: 'Ada Customer' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

        expect(screen.getByRole('heading', { name: 'Ada Customer' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Your profile changes have been saved in this session.');
    });

});

describe('customer application', () => {
    it('renders the home page and primary navigation', () => {
        render(<App />);

        expect(screen.getByRole('heading', {
            name: 'Get your home fixed by people you can trust.',
        })).toBeInTheDocument();
        expect(screen.getByRole('navigation', {
            name: 'Primary navigation',
        })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /post a job/i })).toBeInTheDocument();
    });

    it('filters the sample provider list using the service search', () => {
        render(<App />);

        const search = screen.getByRole('searchbox', { name: 'Search services' });
        fireEvent.change(search, { target: { value: 'Emeka Nwachukwu' } });

        expect(screen.getByText('Emeka Nwachukwu')).toBeInTheDocument();
        expect(screen.queryByText('Tunde Bello')).not.toBeInTheDocument();
    });

    it('opens the post-job screen from the primary action', async () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: /post a job/i }));

        expect(await screen.findByRole('heading', { name: /post a new job/i })).toBeInTheDocument();
    });

    it('filters providers with a quick availability filter', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Available now' }));
        expect(screen.queryByText('Blessing Okafor')).not.toBeInTheDocument();
        expect(screen.getByText('Emeka Nwachukwu')).toBeInTheDocument();
    });
    it('opens My Jobs and filters requests using the redesigned controls', async () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));

        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        const search = screen.getByRole('searchbox', { name: 'Search jobs' });
        fireEvent.change(search, { target: { value: 'Circuit Breaker' } });

        expect(screen.getByRole('heading', { name: 'Circuit Breaker Tripping Frequently' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Fixing Kitchen Sink Leak' })).not.toBeInTheDocument();
    });

    it('does not expose in-app messaging in customer navigation or job actions', async () => {
        render(<App />);
        expect(screen.queryByRole('button', { name: 'Messages' })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));
        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /chat with provider/i })).not.toBeInTheDocument();
        fireEvent.click(screen.getAllByRole('button', { name: /job details/i })[0]);
        expect(await screen.findByRole('heading', { name: 'Job Details' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /chat with provider/i })).not.toBeInTheDocument();
    });

});
