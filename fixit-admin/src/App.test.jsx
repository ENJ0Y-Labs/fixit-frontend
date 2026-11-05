import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('FixIt admin workspace', () => {
    beforeEach(() => {
        window.location.hash = '';
    });

    it('renders the admin dashboard and identifies sample data', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Platform overview' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative sample figures/i)).toBeInTheDocument();
    });

    it('opens the selected workspace section', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /providers/i }));
        expect(screen.getByRole('heading', { name: 'Providers' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'All providers' })).toBeInTheDocument();
    });

    it('filters providers by search and can clear the filter', () => {
        window.location.hash = '#providers';
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search providers' }), { target: { value: 'Amaka' } });
        expect(screen.getByText('Amaka Eze')).toBeInTheDocument();
        expect(screen.queryByText('Chinedu Okafor')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Chinedu Okafor')).toBeInTheDocument();
    });

    it('filters by verification and shows a useful empty state', () => {
        window.location.hash = '#providers';
        render(<App />);
        fireEvent.change(screen.getByLabelText('Verification'), { target: { value: 'Rejected' } });
        expect(screen.getByText('Samuel Briggs')).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Service'), { target: { value: 'Laundry' } });
        expect(screen.getByText(/No providers match these filters/i)).toBeInTheDocument();
    });

    it('opens a read-only provider profile', () => {
        window.location.hash = '#providers';
        render(<App />);
        const row = screen.getByText('Chinedu Okafor').closest('tr');
        fireEvent.click(within(row).getByRole('button', { name: 'View' }));
        expect(screen.getByRole('heading', { name: 'Chinedu Okafor' })).toBeInTheDocument();
        expect(screen.getByText(/Read-only demo profile/i)).toBeInTheDocument();
    });

    it('paginates provider records', () => {
        window.location.hash = '#providers';
        render(<App />);
        expect(screen.getByText('Showing 1–5 of 12')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 6–10 of 12')).toBeInTheDocument();
    });

    it('opens and closes mobile navigation', () => {
        render(<App />);
        const openButton = screen.getByRole('button', { name: 'Open navigation menu' });
        fireEvent.click(openButton);
        expect(openButton).toHaveAttribute('aria-expanded', 'true');
        fireEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }));
        expect(openButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens the customer directory from admin navigation', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /customers/i }));
        expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'All customers' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative only/i)).toBeInTheDocument();
    });

    it('searches customer records and clears the search', () => {
        window.location.hash = '#customers';
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search customers' }), { target: { value: 'Mariam' } });
        expect(screen.getByText('Mariam Abdullahi')).toBeInTheDocument();
        expect(screen.queryByText('Ada Nwankwo')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Ada Nwankwo')).toBeInTheDocument();
    });

    it('filters customer accounts and displays an empty state', () => {
        window.location.hash = '#customers';
        render(<App />);
        fireEvent.change(screen.getByRole('combobox', { name: 'Customer account status' }), { target: { value: 'Suspended' } });
        expect(screen.getByText('Daniel Tamuno')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search customers' }), { target: { value: 'no matching customer' } });
        expect(screen.getByText(/No customers match these filters/i)).toBeInTheDocument();
    });

    it('opens a read-only customer profile', () => {
        window.location.hash = '#customers';
        render(<App />);
        const row = screen.getByText('Ada Nwankwo').closest('tr');
        fireEvent.click(within(row).getByRole('button', { name: 'View' }));
        expect(screen.getByRole('heading', { name: 'Ada Nwankwo' })).toBeInTheDocument();
        expect(screen.getByText(/Read-only demo profile/i)).toBeInTheDocument();
    });

    it('paginates customer records', () => {
        window.location.hash = '#customers';
        render(<App />);
        expect(screen.getByText('Showing 1–5 of 12')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 6–10 of 12')).toBeInTheDocument();
    });
});
