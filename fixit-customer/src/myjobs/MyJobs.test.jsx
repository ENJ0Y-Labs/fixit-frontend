import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MyJobs from './MyJobs.jsx';

const jobs = [
    {
        id: 'JOB-09123',
        category: 'PLUMBING',
        status: 'IN PROGRESS',
        title: 'Fixing Kitchen Sink Leak',
        dateStr: 'Sat, 21 Feb 2026',
        location: 'Victoria Island, Lagos',
        priceLabel: 'AGREED PRICE',
        priceValue: 12500,
        priceSubtext: 'Escrow Secured',
        providerName: 'Emeka Nwachukwu',
        progressPercentage: 75,
    },
    {
        id: 'JOB-09124',
        category: 'ELECTRICAL',
        status: 'AWAITING BIDS',
        title: 'Circuit Breaker Tripping Frequently',
        dateStr: 'Mon, 23 Feb 2026',
        location: 'Ikeja, Lagos',
        priceLabel: 'EST. BUDGET',
        priceValue: 8000,
        minBudget: 8000,
        maxBudget: 15000,
        bidNo: 3,
    },
    {
        id: 'JOB-09125',
        category: 'CLEANING',
        status: 'COMPLETED',
        title: 'Deep House Cleaning (3BR)',
        dateStr: 'Wed, 10 Feb 2026',
        location: 'Surulere, Lagos',
        priceLabel: 'PAID AMOUNT',
        priceValue: 25000,
        providerName: 'Chioma Adeyemi',
        providerRating: 5,
    },
];

describe('MyJobs', () => {
    it('renders job summaries and the available job cards', () => {
        render(<MyJobs jobs={jobs} onPostJob={vi.fn()} onViewDetails={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(screen.getByText('3 total jobs')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Fixing Kitchen Sink Leak' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Circuit Breaker Tripping Frequently' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Deep House Cleaning (3BR)' })).toBeInTheDocument();
    });

    it('filters active jobs, including jobs awaiting bids', () => {
        render(<MyJobs jobs={jobs} onPostJob={vi.fn()} onViewDetails={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: /Active/ }));

        expect(screen.getByRole('heading', { name: 'Fixing Kitchen Sink Leak' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Circuit Breaker Tripping Frequently' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Deep House Cleaning (3BR)' })).not.toBeInTheDocument();
    });

    it('searches job titles and shows an empty result state', () => {
        render(<MyJobs jobs={jobs} onPostJob={vi.fn()} onViewDetails={vi.fn()} />);

        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), {
            target: { value: 'painting' },
        });

        expect(screen.getByRole('heading', { name: 'No matching jobs' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByRole('heading', { name: 'Fixing Kitchen Sink Leak' })).toBeInTheDocument();
    });

    it('opens the selected job details from its card', () => {
        const onViewDetails = vi.fn();
        render(<MyJobs jobs={jobs} onPostJob={vi.fn()} onViewDetails={onViewDetails} />);

        fireEvent.click(screen.getAllByRole('button', { name: /Job Details/ })[0]);

        expect(onViewDetails).toHaveBeenCalledWith(jobs[0]);
    });

    it('shows a useful empty state when there are no jobs', () => {
        const onPostJob = vi.fn();
        render(<MyJobs jobs={[]} onPostJob={onPostJob} onViewDetails={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'No jobs yet' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Post your first job' }));
        expect(onPostJob).toHaveBeenCalledOnce();
    });
});
