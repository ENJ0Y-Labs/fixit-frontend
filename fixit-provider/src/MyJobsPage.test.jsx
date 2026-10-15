import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MyJobsPage from './MyJobsPage.jsx';

const acceptedJob = {
    id: 'job-501',
    title: 'Repair a leaking kitchen sink',
    status: 'PROVIDER_ACCEPTED',
    statusCategory: 'upcoming',
    allowedTransitions: ['START_WORK', 'CANCEL_JOB'],
    agreedAmount: 24500,
    version: 7,
    updatedAt: '2026-10-15T10:30:00Z',
};

afterEach(() => cleanup());

function openConfirmation(transition = 'START_WORK') {
    fireEvent.click(screen.getByRole('button', { name: transition.replace(/[_-]+/g, ' ') }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm update' }));
}

describe('provider My Jobs and progress', () => {
    it('shows the four progress categories and the exact backend-defined status', () => {
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={vi.fn()} />);
        expect(screen.getByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /upcoming \/ accepted/i })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByLabelText('Job status: PROVIDER_ACCEPTED')).toHaveTextContent('PROVIDER_ACCEPTED');
        expect(screen.getByText('₦24,500')).toBeInTheDocument();
    });

    it('only renders transitions explicitly allowed by the backend', () => {
        render(<MyJobsPage dataState="populated" jobs={[{ ...acceptedJob, allowedTransitions: [] }]} onTransitionJob={vi.fn()} />);
        expect(screen.getByText(/no status changes are currently allowed/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /start work/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /cancel job/i })).not.toBeInTheDocument();
    });

    it('requires confirmation and reports success only after the server returns the updated job', async () => {
        const onTransitionJob = vi.fn().mockResolvedValue({
            job: { ...acceptedJob, status: 'WORK_STARTED', statusCategory: 'in-progress', allowedTransitions: ['MARK_COMPLETE'], version: 8 },
        });
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={onTransitionJob} />);

        fireEvent.click(screen.getByRole('button', { name: 'START WORK' }));
        expect(screen.getByRole('alertdialog')).toHaveTextContent(/server must approve/i);
        expect(onTransitionJob).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Confirm update' }));
        await waitFor(() => expect(onTransitionJob).toHaveBeenCalledOnce());
        expect(onTransitionJob).toHaveBeenCalledWith('job-501', {
            transition: 'START_WORK',
            expectedVersion: 7,
            expectedUpdatedAt: acceptedJob.updatedAt,
        });
        expect(await screen.findByRole('status')).toHaveTextContent('Server status: WORK_STARTED');
    });

    it('requires an explicit confirmation for cancellation', () => {
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={vi.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: 'CANCEL JOB' }));
        expect(screen.getByRole('alertdialog')).toHaveTextContent(/cancelling may affect the customer/i);
        expect(screen.getByRole('button', { name: 'Keep current status' })).toBeInTheDocument();
    });

    it('handles stale job data and asks the provider to refresh', async () => {
        const stale = Object.assign(new Error('Conflict'), { status: 409 });
        const onTransitionJob = vi.fn().mockRejectedValue(stale);
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={onTransitionJob} />);
        openConfirmation();

        expect(await screen.findByRole('alert')).toHaveTextContent(/job has changed since you loaded it/i);
        expect(screen.queryByText(/job updated/i)).not.toBeInTheDocument();
    });

    it('does not update a job when the provider is unauthorized', async () => {
        const forbidden = Object.assign(new Error('Forbidden'), { status: 403 });
        const onTransitionJob = vi.fn().mockRejectedValue(forbidden);
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={onTransitionJob} />);
        openConfirmation();

        expect(await screen.findByRole('alert')).toHaveTextContent(/not authorized/i);
        expect(screen.queryByText(/job updated/i)).not.toBeInTheDocument();
    });

    it('reports network failure without claiming the status changed', async () => {
        const onTransitionJob = vi.fn().mockRejectedValue(new Error('Network disconnected'));
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={onTransitionJob} />);
        openConfirmation();

        expect(await screen.findByRole('alert')).toHaveTextContent(/network disconnected/i);
        expect(screen.queryByText(/job updated/i)).not.toBeInTheDocument();
    });

    it('prevents duplicate status updates while a request is pending', async () => {
        let resolveUpdate;
        const onTransitionJob = vi.fn(() => new Promise((resolve) => { resolveUpdate = resolve; }));
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} onTransitionJob={onTransitionJob} />);
        fireEvent.click(screen.getByRole('button', { name: 'START WORK' }));
        const confirm = screen.getByRole('button', { name: 'Confirm update' });
        fireEvent.click(confirm);
        fireEvent.click(confirm);
        expect(onTransitionJob).toHaveBeenCalledOnce();

        resolveUpdate({ job: { ...acceptedJob, status: 'WORK_STARTED', statusCategory: 'in-progress', allowedTransitions: [] } });
        expect(await screen.findByRole('status')).toHaveTextContent('Server status: WORK_STARTED');
    });

    it('shows loading, empty, and error states', () => {
        const { rerender } = render(<MyJobsPage dataState="loading" />);
        expect(screen.getByRole('heading', { name: /loading your jobs/i })).toBeInTheDocument();

        rerender(<MyJobsPage dataState="empty" jobs={[]} />);
        expect(screen.getByRole('heading', { name: /no jobs to show/i })).toBeInTheDocument();

        const onRetry = vi.fn();
        rerender(<MyJobsPage dataState="error" onRetry={onRetry} />);
        fireEvent.click(screen.getByRole('button', { name: /try again/i }));
        expect(onRetry).toHaveBeenCalledOnce();
    });

    it('does not claim a status update when no backend callback exists', () => {
        render(<MyJobsPage dataState="populated" jobs={[acceptedJob]} />);
        expect(screen.getByRole('button', { name: 'START WORK' })).toBeDisabled();
        expect(screen.getByText(/unavailable until the backend is connected/i)).toBeInTheDocument();
    });
});
