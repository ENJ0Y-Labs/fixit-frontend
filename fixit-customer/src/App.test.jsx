import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { authApi } from './api/auth.js';
import { customerApi } from './api/customer.js';

vi.mock('./api/auth.js', () => ({ authApi: { getCurrentUser: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn() } }));
vi.mock('./api/customer.js', () => ({ customerApi: { listJobs: vi.fn(), getJob: vi.fn(), cancelJob: vi.fn(), createJob: vi.fn() } }));
import App from './App.jsx';

beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, '', '/');
    authApi.getCurrentUser.mockRejectedValue(new Error('No active session'));
    customerApi.listJobs.mockRejectedValue(new Error('Customer jobs API unavailable'));
    customerApi.getJob.mockRejectedValue(new Error('Customer job API unavailable'));
    customerApi.cancelJob.mockRejectedValue(new Error('Cancellation unavailable'));
    customerApi.createJob.mockRejectedValue(new Error('Job creation unavailable'));
});
async function renderApp(route = 'marketplace', authenticated = false) {
    if (authenticated) authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 'c1', name: 'Ada' } } });
    window.history.replaceState(null, '', route ? '/#' + route : '/');
    render(<App />);
    await waitFor(() => expect(document.querySelector('.fixit-public-header, .fixit-page-transition')).toBeInTheDocument());
    if (route.startsWith('marketplace')) await screen.findByText(/matching sample listings|matching providers/i);
}
afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });

describe('customer guest-first marketplace', () => {
    it('opens the landing page first and lets visitors enter the marketplace', async () => {
        await renderApp('');
        expect(screen.getByRole('heading', { name: 'Good help for your home, without the guesswork.' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /explore marketplace/i }));
        expect(await screen.findByRole('heading', { name: 'Find the right professional' })).toBeInTheDocument();
        expect(window.location.hash).toBe('#marketplace');
    });
    it('applies a category from a marketplace deep link', async () => {
        await renderApp('marketplace?category=Electrical');
        expect(screen.getByRole('searchbox', { name: 'Search services' })).toHaveValue('Electrical');
        expect(screen.getByText('Tunde Bello')).toBeInTheDocument();
        expect(screen.queryByText('Emeka Nwachukwu')).not.toBeInTheDocument();
    });
    it('opens a provider profile directly from its public URL', async () => {
        await renderApp('provider/chinedu-obi');
        expect(await screen.findByRole('heading', { name: 'Chinedu Obi' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /back to marketplace/i })).toBeInTheDocument();
    });
    it('lets guests search provider listings', async () => {
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search services' }), { target: { value: 'Emeka Nwachukwu' } });
        expect(screen.getByText('Emeka Nwachukwu')).toBeInTheDocument();
        expect(screen.queryByText('Tunde Bello')).not.toBeInTheDocument();
    });
    it('opens public provider profiles', async () => {
        await renderApp();
        fireEvent.click(screen.getAllByRole('button', { name: /view profile/i })[0]);
        expect(await screen.findByRole('heading', { name: 'Tunde Bello' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /request this service/i }));
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    });
    it('requires authentication before entering the customer workspace', async () => {
        await renderApp('my-jobs');
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(window.location.hash).toBe('#login');
    });
    it('shows sign-in while keeping marketplace listings public', async () => {
        await renderApp();
        expect(screen.getByText(/matching sample listings/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
});

describe('customer job management API flow', () => {
    const job = { id: 'job-42', title: 'Repair kitchen tap', status: 'IN_PROGRESS', category: 'PLUMBING', agreedPrice: 12000, serviceLocation: 'Rumuola, Port Harcourt' };
    it('loads real customer jobs and opens details for the selected record', async () => {
        customerApi.listJobs.mockResolvedValueOnce({ data: { items: [job] } });
        customerApi.getJob.mockResolvedValueOnce({ data: { ...job, description: 'The kitchen tap is leaking.' } });
        await renderApp('my-jobs', true);
        expect(await screen.findByText('Repair kitchen tap')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /job details/i }));
        expect(await screen.findByRole('heading', { name: 'Repair kitchen tap' })).toBeInTheDocument();
        expect(customerApi.getJob).toHaveBeenCalledWith('job-42', expect.any(Object));
        await waitFor(() => expect(window.location.hash).toBe('#job-details/job-42'));
    });
    it('loads a job when its detail URL is opened directly', async () => {
        customerApi.listJobs.mockResolvedValueOnce({ data: { items: [] } });
        customerApi.getJob.mockResolvedValueOnce({ data: job });
        await renderApp('job-details/job-42', true);
        expect(await screen.findByRole('heading', { name: 'Repair kitchen tap' })).toBeInTheDocument();
        expect(customerApi.getJob).toHaveBeenCalledWith('job-42', expect.any(Object));
    });
    it('shows an honest empty state instead of sample jobs', async () => {
        customerApi.listJobs.mockResolvedValueOnce({ data: { items: [] } });
        await renderApp('my-jobs', true);
        expect(await screen.findByRole('heading', { name: 'No jobs yet' })).toBeInTheDocument();
        expect(screen.queryByText('Fixing Kitchen Sink Leak')).not.toBeInTheDocument();
    });
    it('shows a failed direct lookup and retries the same job ID', async () => {
        customerApi.listJobs.mockResolvedValueOnce({ data: { items: [] } });
        customerApi.getJob.mockRejectedValueOnce(Object.assign(new Error('Job unavailable'), { status: 404 })).mockResolvedValueOnce({ data: job });
        await renderApp('job-details/job-42', true);
        expect(await screen.findByRole('heading', { name: 'Job unavailable' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /try again/i }));
        expect(await screen.findByRole('heading', { name: 'Repair kitchen tap' })).toBeInTheDocument();
    });
    it('cancels only when the API exposes the cancel action and confirms the saved state', async () => {
        const cancellableJob = { ...job, availableActions: ['cancel'] };
        customerApi.listJobs.mockResolvedValueOnce({ data: { items: [cancellableJob] } });
        customerApi.getJob.mockResolvedValueOnce({ data: cancellableJob });
        customerApi.cancelJob.mockResolvedValueOnce({ data: { ...cancellableJob, status: 'CANCELLED', availableActions: [] } });
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        await renderApp('my-jobs', true);
        await screen.findByText('Repair kitchen tap');
        fireEvent.click(screen.getByRole('button', { name: /job details/i }));
        await screen.findByRole('heading', { name: 'Repair kitchen tap' });
        fireEvent.click(screen.getByRole('button', { name: 'Cancel Job' }));
        expect(customerApi.cancelJob).toHaveBeenCalledWith('job-42');
        expect(await screen.findByRole('heading', { name: 'My Jobs' })).toBeInTheDocument();
        expect(await screen.findByText('CANCELLED')).toBeInTheDocument();
        vi.restoreAllMocks();
    });
    it('creates a job through the API and displays the canonical saved record', async () => {
        customerApi.listJobs.mockResolvedValueOnce({ data: { items: [] } });
        customerApi.createJob.mockResolvedValueOnce({ data: { id: 'job-new', title: 'New tap repair', category: 'Plumbing', status: 'AWAITING_BIDS', budget: 9000 } });
        await renderApp('my-jobs', true);
        await screen.findByRole('heading', { name: 'My Jobs' });
        fireEvent.click(screen.getByRole('button', { name: /post a new job/i }));
        fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'New tap repair' } });
        fireEvent.change(screen.getByLabelText('Service Category'), { target: { value: 'Plumbing' } });
        fireEvent.change(screen.getByLabelText('Service Location'), { target: { value: 'Rumuola, Port Harcourt' } });
        fireEvent.change(screen.getByLabelText('Estimated Budget (₦)'), { target: { value: '9000' } });
        fireEvent.click(screen.getByRole('button', { name: 'Post This Job' }));
        expect(await screen.findByText('New tap repair')).toBeInTheDocument();
        expect(customerApi.createJob).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New tap repair',
            category: 'Plumbing',
            serviceLocation: 'Rumuola, Port Harcourt',
            budget: 9000,
        }));
    });
    it('shows an API error and allows the customer to retry', async () => {
        customerApi.listJobs.mockRejectedValueOnce(new Error('Service temporarily unavailable')).mockResolvedValueOnce({ data: { items: [job] } });
        await renderApp('my-jobs', true);
        expect(await screen.findByRole('heading', { name: "We couldn't load your jobs" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /try again/i }));
        expect(await screen.findByText('Repair kitchen tap')).toBeInTheDocument();
    });
});
