import { describe, expect, it } from 'vitest';
import { extractJob, extractJobList, normalizeJob, normalizeJobStatus } from './customerJobs.js';

describe('customer job data mapping', () => {
    it('normalizes the documented list envelope without inventing optional fields', () => {
        const jobs = extractJobList({ data: { items: [{ id: 'job-1', title: 'Repair tap', status: 'AWAITING_BIDS' }] } });
        expect(jobs).toHaveLength(1);
        expect(jobs[0]).toMatchObject({ id: 'job-1', title: 'Repair tap', status: 'AWAITING BIDS', providerName: '', priceValue: null });
        expect(jobs[0].provider).toBeNull();
    });

    it('maps backend snake_case fields and provider details', () => {
        const job = normalizeJob({
            job_id: 'job-2',
            job_title: 'Fix wiring',
            status: 'IN_PROGRESS',
            category: { name: 'Electrical' },
            agreed_price: 125000,
            scheduled_at: '2026-11-20T09:00:00Z',
            service_location: 'Rumuola, Port Harcourt',
            provider: { fullName: 'Ada Obi', profession: 'Electrician', rating: 4.8, review_count: 12 },
        });
        expect(job).toMatchObject({
            id: 'job-2',
            title: 'Fix wiring',
            category: 'ELECTRICAL',
            status: 'IN PROGRESS',
            priceValue: 125000,
            providerName: 'Ada Obi',
            provider: { name: 'Ada Obi', title: 'Electrician', rating: 4.8, reviewcount: 12 },
        });
    });

    it('normalizes known backend status aliases without changing unknown values', () => {
        expect(normalizeJobStatus('pending')).toBe('AWAITING BIDS');
        expect(normalizeJobStatus('in_progress')).toBe('IN PROGRESS');
        expect(normalizeJobStatus('cancelled')).toBe('CANCELLED');
        expect(normalizeJobStatus('awaiting_review')).toBe('AWAITING REVIEW');
    });

    it('extracts a single job response and handles invalid payloads', () => {
        expect(extractJob({ data: { job: { id: 'job-3', title: 'Paint room' } } }).id).toBe('job-3');
        expect(extractJob({ data: null })).toBeNull();
        expect(extractJobList({ data: { items: 'invalid' } })).toEqual([]);
    });
});
