import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

async function renderApp() {
    render(<App />);
    await waitFor(() => expect(document.querySelector('.fixit-page-transition')).toBeInTheDocument());
}

describe('FixIt admin workspace', () => {
    beforeEach(() => {
        window.location.hash = '';
    });

    it('renders the admin dashboard and identifies sample data', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Platform overview' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative sample figures/i)).toBeInTheDocument();
        expect([...document.querySelectorAll('.admin-nav .nav-icon i')].every((icon) => [...icon.classList].some((name) => name.startsWith('fa-')))).toBe(true);
    });

    it('opens the selected workspace section', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /providers/i }));
        expect(await screen.findByRole('heading', { name: 'Providers' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'All providers' })).toBeInTheDocument();
    });

    it('filters providers by search and can clear the filter', async () => {
        window.location.hash = '#providers';
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search providers' }), { target: { value: 'Amaka' } });
        expect(screen.getByText('Amaka Eze')).toBeInTheDocument();
        expect(screen.queryByText('Chinedu Okafor')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Chinedu Okafor')).toBeInTheDocument();
    });

    it('filters by verification and shows a useful empty state', async () => {
        window.location.hash = '#providers';
        await renderApp();
        fireEvent.change(screen.getByLabelText('Verification'), { target: { value: 'Rejected' } });
        expect(screen.getByText('Samuel Briggs')).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Service'), { target: { value: 'Laundry' } });
        expect(screen.getByText(/No providers match these filters/i)).toBeInTheDocument();
    });

    it('opens a read-only provider profile', async () => {
        window.location.hash = '#providers';
        await renderApp();
        const row = screen.getByText('Chinedu Okafor').closest('tr');
        fireEvent.click(within(row).getByRole('button', { name: 'View' }));
        expect(screen.getByRole('heading', { name: 'Chinedu Okafor' })).toBeInTheDocument();
        expect(screen.getByText(/Read-only demo profile/i)).toBeInTheDocument();
    });

    it('paginates provider records', async () => {
        window.location.hash = '#providers';
        await renderApp();
        expect(screen.getByText('Showing 1–5 of 12')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 6–10 of 12')).toBeInTheDocument();
    });

    it('opens and closes mobile navigation', async () => {
        await renderApp();
        const openButton = screen.getByLabelText('Open navigation menu');
        fireEvent.click(openButton);
        expect(openButton).toHaveAttribute('aria-expanded', 'true');
        fireEvent.click(screen.getByLabelText('Close navigation menu'));
        expect(openButton).toHaveAttribute('aria-expanded', 'false');
        expect(openButton).toHaveFocus();
    });

    it('opens the customer directory from admin navigation', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /customers/i }));
        expect(await screen.findByRole('heading', { name: 'Customers' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'All customers' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative only/i)).toBeInTheDocument();
    });

    it('searches customer records and clears the search', async () => {
        window.location.hash = '#customers';
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search customers' }), { target: { value: 'Mariam' } });
        expect(screen.getByText('Mariam Abdullahi')).toBeInTheDocument();
        expect(screen.queryByText('Ada Nwankwo')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Ada Nwankwo')).toBeInTheDocument();
    });

    it('filters customer accounts and displays an empty state', async () => {
        window.location.hash = '#customers';
        await renderApp();
        fireEvent.change(screen.getByRole('combobox', { name: 'Customer account status' }), { target: { value: 'Suspended' } });
        expect(screen.getByText('Daniel Tamuno')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search customers' }), { target: { value: 'no matching customer' } });
        expect(screen.getByText(/No customers match these filters/i)).toBeInTheDocument();
    });

    it('opens a read-only customer profile', async () => {
        window.location.hash = '#customers';
        await renderApp();
        const row = screen.getByText('Ada Nwankwo').closest('tr');
        fireEvent.click(within(row).getByRole('button', { name: 'View' }));
        expect(screen.getByRole('heading', { name: 'Ada Nwankwo' })).toBeInTheDocument();
        expect(screen.getByText(/Read-only demo profile/i)).toBeInTheDocument();
    });

    it('paginates customer records', async () => {
        window.location.hash = '#customers';
        await renderApp();
        expect(screen.getByText('Showing 1–5 of 12')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 6–10 of 12')).toBeInTheDocument();
    });

    it('opens the provider verification workspace', async () => {
        await renderApp();
        fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name: /^Verification/ }));
        expect(await screen.findByRole('heading', { name: 'Provider verification' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Verification queue' })).toBeInTheDocument();
        expect(screen.getByText(/No real documents are attached/i)).toBeInTheDocument();
    });

    it('searches verification cases and filters by review status', async () => {
        window.location.hash = '#verification';
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search verification cases' }), { target: { value: 'Chinedu' } });
        expect(screen.getByText('Chinedu Okafor')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Adaeze Nwosu' })).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search verification cases' }), { target: { value: '' } });
        fireEvent.change(screen.getByRole('combobox', { name: 'Verification status' }), { target: { value: 'Needs information' } });
        expect(screen.getByText('Mariam Danjuma')).toBeInTheDocument();
    });

    it('requires a review note for demo requests and rejections', async () => {
        window.location.hash = '#verification';
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Request information (demo)' }));
        expect(screen.getByText(/Add a review note before requesting information/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Review note/i), { target: { value: 'Please provide a clearer proof of address.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Request information (demo)' }));
        expect(screen.getByText(/Demo state changed to “Needs information”/i)).toBeInTheDocument();
        expect(screen.getByText(/This change exists only in this browser session/i)).toBeInTheDocument();
    });

    it('updates only the local demo state when a case is approved', async () => {
        window.location.hash = '#verification';
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Approve (demo)' }));
        expect(screen.getByText(/Demo state changed to “Approved”/i)).toBeInTheDocument();
        expect(within(document.querySelector('.verification-table')).getAllByText('Approved', { selector: '.status-badge' })).toHaveLength(2);
        fireEvent.click(screen.getByRole('button', { name: 'Reset demo data' }));
        expect(screen.getAllByText('Pending review', { selector: '.status-badge' }).length).toBeGreaterThan(0);
    });

    it('paginates all verification cases', async () => {
        window.location.hash = '#verification';
        await renderApp();
        fireEvent.change(screen.getByRole('combobox', { name: 'Verification status' }), { target: { value: 'All' } });
        expect(screen.getByText('Showing 1–5 of 8')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 6–8 of 8')).toBeInTheDocument();
    });
});


describe('admin jobs workspace', () => {
    it('opens the read-only jobs oversight page', async () => {
        window.location.hash = '#jobs';
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Jobs' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Marketplace jobs' })).toBeInTheDocument();
        expect(screen.getByText(/not live marketplace data/i)).toBeInTheDocument();
    });

    it('searches jobs by customer, provider, and job details', async () => {
        window.location.hash = '#jobs';
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), { target: { value: 'Chinedu' } });
        expect(within(document.querySelector('.jobs-table')).getByText('Kitchen sink pipe repair')).toBeInTheDocument();
        expect(within(document.querySelector('.jobs-table')).queryByText('Two-bedroom deep cleaning')).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), { target: { value: 'FX-2057' } });
        expect(within(document.querySelector('.jobs-table')).getByText('Electrical safety inspection')).toBeInTheDocument();
    });

    it('filters jobs by status and category and supports clearing filters', async () => {
        window.location.hash = '#jobs';
        await renderApp();
        fireEvent.change(screen.getByRole('combobox', { name: 'Job status' }), { target: { value: 'COMPLETED' } });
        expect(screen.getByText('Two-bedroom deep cleaning')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Job category' }), { target: { value: 'Cleaning' } });
        expect(screen.getByText('Showing 1–1 of 1')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Showing 1–6 of 12')).toBeInTheDocument();
    });

    it('shows read-only job details and paginates records', async () => {
        window.location.hash = '#jobs';
        await renderApp();
        expect(screen.getByText(/Read-only demo details/i)).toBeInTheDocument();
        expect(screen.getByText('Showing 1–6 of 12')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 7–12 of 12')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Jobs' })).toBeInTheDocument();
    });

    it('shows a useful empty state when no jobs match', async () => {
        window.location.hash = '#jobs';
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), { target: { value: 'no such job exists' } });
        expect(screen.getByText('No jobs match these filters')).toBeInTheDocument();
    });
});


describe('admin disputes and support workspace', () => {
    beforeEach(() => { window.location.hash = '#disputes-support'; });

    it('opens the combined dispute and support inbox', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Disputes & support' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Case inbox' })).toBeInTheDocument();
        expect(screen.getByText(/No real support inbox/i)).toBeInTheDocument();
    });

    it('searches by case, job, subject, and participant', async () => {
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search support cases' }), { target: { value: 'Tunde' } });
        expect(within(document.querySelector('.support-table')).getByText('Work marked complete before repair was finished')).toBeInTheDocument();
        expect(within(document.querySelector('.support-table')).queryByText('Unable to update phone number')).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search support cases' }), { target: { value: 'FX-2054' } });
        expect(within(document.querySelector('.support-table')).getByText('Final amount differs from initial estimate')).toBeInTheDocument();
    });

    it('filters case type, status, and priority', async () => {
        await renderApp();
        fireEvent.change(screen.getByRole('combobox', { name: 'Case type' }), { target: { value: 'Support' } });
        expect(screen.getByText('Unable to update phone number')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Work marked complete before repair was finished' })).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Case status' }), { target: { value: 'OPEN' } });
        expect(screen.getByText('Cannot see provider replies')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Case priority' }), { target: { value: 'Low' } });
        expect(screen.getByText('Showing 0–0 of 0')).toBeInTheDocument();
    });

    it('shows an empty state and clears filters', async () => {
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search support cases' }), { target: { value: 'not a real case' } });
        expect(screen.getByText('No cases match these filters')).toBeInTheDocument();
        fireEvent.click(within(document.querySelector('.support-filters')).getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Showing 1–6 of 10')).toBeInTheDocument();
    });

    it('shows the case timeline, evidence metadata, and participant context', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Case activity' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Evidence checklist' })).toBeInTheDocument();
        expect(screen.getAllByText('Tunde Ekanem').length).toBeGreaterThan(0);
        expect(screen.getByText(/No files are attached/i)).toBeInTheDocument();
    });

    it('adds a temporary demo note and updates only local case status', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Add note (demo)' }));
        expect(screen.getByText(/Enter a note before adding it/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Add internal note (demo)'), { target: { value: 'Check provider response before closing.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add note (demo)' }));
        expect(screen.getByText('Check provider response before closing.')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Demo case status' }), { target: { value: 'RESOLVED' } });
        expect(screen.getByText(/Demo case status changed to “Resolved”/i)).toBeInTheDocument();
        expect(screen.getByText(/not sent to FixIt servers/i)).toBeInTheDocument();
    });

    it('paginates the sample case queue', async () => {
        await renderApp();
        expect(screen.getByText('Showing 1–6 of 10')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 7–10 of 10')).toBeInTheDocument();
    });
});


describe('admin categories workspace', () => {
    beforeEach(() => { window.location.hash = '#categories'; });

    it('opens the service category workspace with sample records', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Service categories' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative sample data/i)).toBeInTheDocument();
        expect(screen.getAllByText('Plumbing').length).toBeGreaterThan(0);
    });

    it('searches categories and filters by active status', async () => {
        await renderApp();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search categories' }), { target: { value: 'painting' } });
        expect(screen.getByText('Painting')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Category status' }), { target: { value: 'ACTIVE' } });
        expect(screen.getByText('No categories match these filters')).toBeInTheDocument();
        fireEvent.click(within(document.querySelector('.categories-filters')).getByRole('button', { name: 'Clear filters' }));
        expect(screen.getAllByText('Plumbing').length).toBeGreaterThan(0);
    });

    it('shows category details and example services', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Plumbing' })).toBeInTheDocument();
        expect(screen.getByText('Pipe repair')).toBeInTheDocument();
        expect(screen.getByText(/No customer discovery, provider listings/i)).toBeInTheDocument();
    });

    it('validates and creates a temporary demo category', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /Add category/i }));
        fireEvent.click(screen.getByRole('button', { name: 'Create demo category' }));
        expect(screen.getByText(/Enter both a category name and description/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Category name'), { target: { value: 'Home maintenance' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'General home maintenance services.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create demo category' }));
        expect(screen.getByRole('heading', { name: 'Home maintenance' })).toBeInTheDocument();
        expect(screen.getAllByText(/temporary browser state/i).length).toBeGreaterThan(0);
    });

    it('prevents duplicate category names', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /Add category/i }));
        fireEvent.change(screen.getByLabelText('Category name'), { target: { value: 'plumbing' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Duplicate category attempt.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create demo category' }));
        expect(screen.getByText(/A category with this name already exists/i)).toBeInTheDocument();
    });

    it('edits and deactivates only the local demo category', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Edit category' }));
        fireEvent.change(screen.getByLabelText('Category name'), { target: { value: 'Home plumbing' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save demo changes' }));
        expect(screen.getByRole('heading', { name: 'Home plumbing' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Deactivate (demo)' }));
        expect(screen.getByText(/marked inactive/i)).toBeInTheDocument();
        expect(screen.getAllByText('Inactive', { selector: '.status-badge' }).length).toBeGreaterThan(0);
    });

    it('paginates category records', async () => {
        await renderApp();
        expect(screen.getByText('Showing 1–6 of 10')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 7–10 of 10')).toBeInTheDocument();
    });
});


describe('admin analytics workspace', () => {
    beforeEach(() => { window.location.hash = '#analytics'; });

    it('opens analytics with clearly identified sample figures', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
        expect(screen.getByText(/not live FixIt reporting/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Job activity' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Job status breakdown' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Top service categories' })).toBeInTheDocument();
    });

    it('changes the reporting period and recalculates summary metrics', async () => {
        await renderApp();
        expect(screen.getByText('491')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Reporting period' }), { target: { value: '7d' } });
        expect(screen.getByText('173')).toBeInTheDocument();
        expect(screen.getByText('105')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Reporting period' }), { target: { value: '90d' } });
        expect(screen.getByText('1,289')).toBeInTheDocument();
    });

    it('labels estimated job value separately from revenue and payments', async () => {
        await renderApp();
        expect(screen.getByText('Estimated job value')).toBeInTheDocument();
        expect(screen.getByText(/Not revenue or payments/i)).toBeInTheDocument();
        expect(screen.getByText(/not provider earnings, agreed job prices, platform revenue/i)).toBeInTheDocument();
    });

    it('opens analytics from the admin navigation', async () => {
        window.location.hash = '';
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
        expect(await screen.findByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
    });
});


describe('admin settings workspace', () => {
    beforeEach(() => { window.location.hash = '#settings'; });

    it('opens settings with demo-only and read-only boundaries', async () => {
        await renderApp();
        expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Admin profile' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Notification preferences' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Platform information' })).toBeInTheDocument();
        expect(screen.getByText(/temporary browser state/i)).toBeInTheDocument();
    });

    it('updates notification preferences and applies them only in the demo page', async () => {
        await renderApp();
        const weeklySummary = screen.getByRole('checkbox', { name: /Weekly activity summary/i });
        expect(weeklySummary).not.toBeChecked();
        fireEvent.click(weeklySummary);
        expect(weeklySummary).toBeChecked();
        fireEvent.click(screen.getByRole('button', { name: 'Apply demo preferences' }));
        expect(screen.getByRole('status')).toHaveTextContent(/not been saved to FixIt servers/i);
    });

    it('changes regional preferences and resets demo values', async () => {
        await renderApp();
        const timezone = screen.getByRole('combobox', { name: /Time zone/ });
        fireEvent.change(timezone, { target: { value: 'UTC' } });
        expect(timezone).toHaveValue('UTC');
        fireEvent.click(screen.getByRole('button', { name: 'Reset demo preferences' }));
        expect(timezone).toHaveValue('Africa/Lagos');
        expect(screen.getByRole('status')).toHaveTextContent(/reset to their defaults/i);
    });

    it('opens settings from admin navigation', async () => {
        window.location.hash = '';
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
        expect(await screen.findByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    });
    it('requires the local demo credentials before opening the admin workspace', async () => {
        vi.stubEnv('MODE', 'development');
        vi.stubEnv('DEV', true);
        localStorage.removeItem('fixit-demo-session:admin');
        render(<App />);
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in to admin workspace' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/incorrect/i);
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'FixitDemo123!' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in to admin workspace' }));
        expect(await screen.findByRole('heading', { name: 'Platform overview' })).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('fixit-demo-session:admin'))).toMatchObject({ role: 'admin', isDemo: true });
        fireEvent.click(screen.getByRole('button', { name: /log out/i }));
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(localStorage.getItem('fixit-demo-session:admin')).toBeNull();
        vi.unstubAllEnvs();
    });

});
