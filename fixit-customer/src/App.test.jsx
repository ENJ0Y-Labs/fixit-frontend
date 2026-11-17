import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

afterEach(() => {
    cleanup();
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
        fireEvent.click(screen.getByRole('button', { name: /job details/i }));
        expect(await screen.findByRole('heading', { name: 'Job Details' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /chat with provider/i })).not.toBeInTheDocument();
    });

});
