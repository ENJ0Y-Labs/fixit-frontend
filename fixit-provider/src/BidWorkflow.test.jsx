import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BidWorkflow from './BidWorkflow.jsx';

const job = { id: 'job-201', title: 'Repair leaking kitchen sink' };

afterEach(() => cleanup());

function fillValidQuote() {
    fireEvent.change(screen.getByLabelText(/your quote/i), { target: { value: '24500' } });
    fireEvent.change(screen.getByLabelText(/message to the customer/i), {
        target: { value: 'I will inspect the pipe joint and include standard fittings.' },
    });
}

describe('provider bid workflow', () => {
    it('requires a valid positive price and a message', async () => {
        const onSubmitBid = vi.fn();
        render(<BidWorkflow job={job} onSubmitBid={onSubmitBid} />);

        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/valid price greater than/i);
        expect(onSubmitBid).not.toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText(/your quote/i), { target: { value: '-5' } });
        fireEvent.change(screen.getByLabelText(/message to the customer/i), { target: { value: 'A quote' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/valid price greater than/i);
        expect(onSubmitBid).not.toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText(/your quote/i), { target: { value: '15000' } });
        fireEvent.change(screen.getByLabelText(/message to the customer/i), { target: { value: '   ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/add a message/i);
        expect(onSubmitBid).not.toHaveBeenCalled();
    });

    it('sends the quote and optional proposed schedule to the callback', async () => {
        const onSubmitBid = vi.fn().mockResolvedValue({
            id: 'bid-100',
            status: 'PENDING_CUSTOMER_REVIEW',
            price: 24500,
            message: 'I will inspect the pipe joint and include standard fittings.',
        });
        render(<BidWorkflow job={job} onSubmitBid={onSubmitBid} />);
        fillValidQuote();
        fireEvent.change(screen.getByLabelText(/proposed schedule/i), { target: { value: '2026-10-20T10:30' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));

        await waitFor(() => expect(onSubmitBid).toHaveBeenCalledOnce());
        expect(onSubmitBid).toHaveBeenCalledWith('job-201', {
            price: 24500,
            currency: 'NGN',
            message: 'I will inspect the pipe joint and include standard fittings.',
            proposedSchedule: '2026-10-20T10:30',
        });
        expect(await screen.findByRole('status')).toHaveTextContent('PENDING_CUSTOMER_REVIEW');
        expect(screen.getByRole('button', { name: 'Bid submitted' })).toBeDisabled();
    });

    it('does not show success when the response lacks a server bid id or status', async () => {
        const onSubmitBid = vi.fn().mockResolvedValue({ price: 24500 });
        render(<BidWorkflow job={job} onSubmitBid={onSubmitBid} />);
        fillValidQuote();
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(/could not confirm this bid/i);
        expect(screen.queryByText(/bid confirmed by the server/i)).not.toBeInTheDocument();
    });

    it('prevents duplicate submissions from rapid clicks', async () => {
        let resolveSubmission;
        const onSubmitBid = vi.fn(() => new Promise((resolve) => { resolveSubmission = resolve; }));
        render(<BidWorkflow job={job} onSubmitBid={onSubmitBid} />);
        fillValidQuote();

        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));
        fireEvent.click(screen.getByRole('button', { name: /submitting quote/i }));
        expect(onSubmitBid).toHaveBeenCalledOnce();

        resolveSubmission({ id: 'bid-101', status: 'SUBMITTED', price: 24500, message: 'Quote' });
        expect(await screen.findByText(/bid confirmed by the server/i)).toBeInTheDocument();
    });

    it('preserves the form and reports submission failures', async () => {
        const onSubmitBid = vi.fn().mockRejectedValue(new Error('Service temporarily unavailable'));
        render(<BidWorkflow job={job} onSubmitBid={onSubmitBid} />);
        fillValidQuote();
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Service temporarily unavailable');
        expect(screen.getByLabelText(/your quote/i)).toHaveValue(24500);
        expect(screen.queryByText(/bid confirmed by the server/i)).not.toBeInTheDocument();
    });

    it('handles a conflict when the job is no longer available', async () => {
        const conflict = Object.assign(new Error('Conflict'), { status: 409 });
        const onSubmitBid = vi.fn().mockRejectedValue(conflict);
        render(<BidWorkflow job={job} onSubmitBid={onSubmitBid} />);
        fillValidQuote();
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(/job is no longer available/i);
        expect(screen.queryByText(/bid confirmed by the server/i)).not.toBeInTheDocument();
    });

    it('displays submitted bid statuses exactly as provided by the server', () => {
        render(<BidWorkflow job={job} submittedBids={[
            { id: 'bid-102', jobId: 'job-201', price: 21000, message: 'Can attend this week.', status: 'AWAITING_PROVIDER_REVIEW' },
        ]} />);
        expect(screen.getByLabelText('Bid status: AWAITING_PROVIDER_REVIEW')).toBeInTheDocument();
        expect(screen.getByText('AWAITING PROVIDER REVIEW')).toBeInTheDocument();
    });

    it('never claims a bid was sent when the backend callback is missing', async () => {
        render(<BidWorkflow job={job} />);
        fillValidQuote();
        fireEvent.click(screen.getByRole('button', { name: 'Submit quote' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(/not connected to the backend/i);
        expect(screen.queryByText(/bid confirmed by the server/i)).not.toBeInTheDocument();
    });
});
