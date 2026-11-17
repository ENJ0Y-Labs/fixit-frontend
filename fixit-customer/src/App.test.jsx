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
            name: 'Get your home fixed by trusted local pros.',
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

    it('preserves My Jobs search, status filter, and sorting when returning from Post a Job', async () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: 'My Jobs' }));
        const search = await screen.findByRole('searchbox', { name: 'Search jobs' });
        fireEvent.change(search, { target: { value: 'kitchen' } });
        fireEvent.click(screen.getByRole('button', { name: /Active/ }));
        fireEvent.change(screen.getByRole('combobox', { name: 'Sort jobs' }), { target: { value: 'price' } });

        fireEvent.click(screen.getByRole('button', { name: 'Post New Job' }));
        expect(await screen.findByRole('heading', { name: 'Post a New Job' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Go back' }));

        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(screen.getByRole('searchbox', { name: 'Search jobs' })).toHaveValue('kitchen');
        expect(screen.getByRole('button', { name: /Active/ })).toHaveClass('active');
        expect(screen.getByRole('combobox', { name: 'Sort jobs' })).toHaveValue('price');
    });

});
