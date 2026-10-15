import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AvailableJobsPage from './AvailableJobsPage.jsx';

afterEach(() => cleanup());

describe('available jobs discovery', () => {
    it('labels opportunities as demo records and renders cards with naira budgets', () => {
        render(<AvailableJobsPage />);
        expect(screen.getByText('Demo opportunities')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Available Jobs' })).toBeInTheDocument();
        expect(screen.getByText('₦18,000')).toBeInTheDocument();
        expect(screen.getByText(/customer contact details are intentionally hidden/i)).toBeInTheDocument();
    });

    it('combines text search, category, area, and budget filters', () => {
        render(<AvailableJobsPage />);
        fireEvent.change(screen.getByLabelText('Search jobs'), { target: { value: 'sink' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Plumbing' } });
        fireEvent.change(screen.getByLabelText('Area'), { target: { value: 'Rumuola' } });
        fireEvent.change(screen.getByLabelText('Budget'), { target: { value: 'under-20000' } });
        expect(screen.getByRole('heading', { name: 'Repair leaking kitchen sink' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Inspect a faulty water pump' })).not.toBeInTheDocument();
        expect(screen.getByText('1 opportunity')).toBeInTheDocument();
    });

    it('shows an empty state when no jobs match and can clear filters', () => {
        render(<AvailableJobsPage />);
        fireEvent.change(screen.getByLabelText('Search jobs'), { target: { value: 'unicorn' } });
        expect(screen.getByRole('heading', { name: 'No matching jobs' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));
        expect(screen.getByRole('heading', { name: 'Repair leaking kitchen sink' })).toBeInTheDocument();
    });

    it('paginates results and disables navigation at the ends', () => {
        render(<AvailableJobsPage pageSize={2} />);
        expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Page 2 of 4')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Fix a bedroom door lock' })).toBeInTheDocument();
    });

    it('resets pagination when a filter changes', () => {
        render(<AvailableJobsPage pageSize={1} />);
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Plumbing' } });
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Repair leaking kitchen sink' })).toBeInTheDocument();
    });

    it('sorts matching jobs by budget', () => {
        render(<AvailableJobsPage />);
        fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'budget-low' } });
        const cards = screen.getAllByRole('article');
        expect(within(cards[0]).getByRole('heading', { name: 'Fix a bedroom door lock' })).toBeInTheDocument();
    });


    it('sorts most recent records ahead of older records', () => {
        render(<AvailableJobsPage pageSize={8} />);
        const cards = screen.getAllByRole('article');
        expect(within(cards[0]).getByRole('heading', { name: 'Repair leaking kitchen sink' })).toBeInTheDocument();
        expect(within(cards[1]).getByRole('heading', { name: 'Service split air conditioner' })).toBeInTheDocument();
    });
    it('shows loading, error/retry, and stale-record states', () => {
        const { rerender } = render(<AvailableJobsPage dataState="loading" />);
        expect(screen.getByRole('heading', { name: 'Loading available jobs' })).toBeInTheDocument();
        const onRetry = vi.fn();
        rerender(<AvailableJobsPage dataState="error" onRetry={onRetry} />);
        expect(screen.getByRole('alert')).toHaveTextContent(/couldn’t load available jobs/i);
        fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
        expect(onRetry).toHaveBeenCalledOnce();
        rerender(<AvailableJobsPage dataState="stale" />);
        expect(screen.getByRole('status')).toHaveTextContent(/out of date/i);
    });

    it('opens job details while protecting customer identity and exact address', () => {
        render(<AvailableJobsPage />);
        fireEvent.click(screen.getAllByRole('button', { name: /view details/i })[0]);
        expect(screen.getByRole('heading', { name: 'Repair leaking kitchen sink' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Customer details are protected' })).toBeInTheDocument();
        expect(screen.getByText(/customer name, phone number, and exact street address are not available/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit quote' })).toBeEnabled();
        fireEvent.click(screen.getByRole('button', { name: /back to available jobs/i }));
        expect(screen.getByRole('heading', { name: 'Available Jobs' })).toBeInTheDocument();
    });


    it('marks an individual potentially stale record before details are opened', () => {
        render(<AvailableJobsPage pageSize={10} />);
        const staleCard = screen.getByRole('heading', { name: 'Inspect a faulty water pump' }).closest('article');
        expect(within(staleCard).getByText('May be outdated')).toBeInTheDocument();
        fireEvent.click(within(staleCard).getByRole('button', { name: /view details/i }));
        expect(screen.getByText('May be outdated')).toBeInTheDocument();
    });
    it('does not show records that are not open', () => {
        const jobs = [{ id: 'closed-1', title: 'Closed job', category: 'Plumbing', description: 'Closed', location: 'GRA, Port Harcourt', budget: 1000, urgency: 'Flexible', postedAt: 'Today', duration: '1 hour', bids: 0, status: 'COMPLETED' }];
        render(<AvailableJobsPage jobs={jobs} />);
        expect(screen.getByRole('heading', { name: 'No matching jobs' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Closed job' })).not.toBeInTheDocument();
    });
});
