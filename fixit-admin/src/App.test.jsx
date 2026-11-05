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

    it('opens the provider verification workspace', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /verification/i }));
        expect(screen.getByRole('heading', { name: 'Provider verification' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Verification queue' })).toBeInTheDocument();
        expect(screen.getByText(/No real documents are attached/i)).toBeInTheDocument();
    });

    it('searches verification cases and filters by review status', () => {
        window.location.hash = '#verification';
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search verification cases' }), { target: { value: 'Chinedu' } });
        expect(screen.getByText('Chinedu Okafor')).toBeInTheDocument();
        expect(screen.queryByText('Adaeze Nwosu')).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search verification cases' }), { target: { value: '' } });
        fireEvent.change(screen.getByRole('combobox', { name: 'Verification status' }), { target: { value: 'Needs information' } });
        expect(screen.getByText('Mariam Danjuma')).toBeInTheDocument();
    });

    it('requires a review note for demo requests and rejections', () => {
        window.location.hash = '#verification';
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Request information (demo)' }));
        expect(screen.getByText(/Add a review note before requesting information/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Review note/i), { target: { value: 'Please provide a clearer proof of address.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Request information (demo)' }));
        expect(screen.getByText(/Demo state changed to “Needs information”/i)).toBeInTheDocument();
        expect(screen.getByText(/This change exists only in this browser session/i)).toBeInTheDocument();
    });

    it('updates only the local demo state when a case is approved', () => {
        window.location.hash = '#verification';
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Approve (demo)' }));
        expect(screen.getByText(/Demo state changed to “Approved”/i)).toBeInTheDocument();
        expect(screen.getAllByText('Approved', { selector: '.status-badge' })).toHaveLength(2);
        fireEvent.click(screen.getByRole('button', { name: 'Reset demo data' }));
        expect(screen.getAllByText('Pending review', { selector: '.status-badge' }).length).toBeGreaterThan(0);
    });

    it('paginates all verification cases', () => {
        window.location.hash = '#verification';
        render(<App />);
        fireEvent.change(screen.getByRole('combobox', { name: 'Verification status' }), { target: { value: 'All' } });
        expect(screen.getByText('Showing 1–5 of 8')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 6–8 of 8')).toBeInTheDocument();
    });
});


describe('admin jobs workspace', () => {
    it('opens the read-only jobs oversight page', () => {
        window.location.hash = '#jobs';
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Jobs' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Marketplace jobs' })).toBeInTheDocument();
        expect(screen.getByText(/not live marketplace data/i)).toBeInTheDocument();
    });

    it('searches jobs by customer, provider, and job details', () => {
        window.location.hash = '#jobs';
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), { target: { value: 'Chinedu' } });
        expect(screen.getByText('Kitchen sink pipe repair')).toBeInTheDocument();
        expect(screen.queryByText('Two-bedroom deep cleaning')).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), { target: { value: 'FX-2057' } });
        expect(screen.getByText('Electrical safety inspection')).toBeInTheDocument();
    });

    it('filters jobs by status and category and supports clearing filters', () => {
        window.location.hash = '#jobs';
        render(<App />);
        fireEvent.change(screen.getByRole('combobox', { name: 'Job status' }), { target: { value: 'COMPLETED' } });
        expect(screen.getByText('Two-bedroom deep cleaning')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Job category' }), { target: { value: 'Cleaning' } });
        expect(screen.getByText('Showing 1–1 of 1')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Showing 1–6 of 12')).toBeInTheDocument();
    });

    it('shows read-only job details and paginates records', () => {
        window.location.hash = '#jobs';
        render(<App />);
        expect(screen.getByText(/Read-only demo details/i)).toBeInTheDocument();
        expect(screen.getByText('Showing 1–6 of 12')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 7–12 of 12')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Jobs' })).toBeInTheDocument();
    });

    it('shows a useful empty state when no jobs match', () => {
        window.location.hash = '#jobs';
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search jobs' }), { target: { value: 'no such job exists' } });
        expect(screen.getByText('No jobs match these filters')).toBeInTheDocument();
    });
});


describe('admin disputes and support workspace', () => {
    beforeEach(() => { window.location.hash = '#disputes-support'; });

    it('opens the combined dispute and support inbox', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Disputes & support' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Case inbox' })).toBeInTheDocument();
        expect(screen.getByText(/No real support inbox/i)).toBeInTheDocument();
    });

    it('searches by case, job, subject, and participant', () => {
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search support cases' }), { target: { value: 'Tunde' } });
        expect(screen.getByText('Work marked complete before repair was finished')).toBeInTheDocument();
        expect(screen.queryByText('Unable to update phone number')).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search support cases' }), { target: { value: 'FX-2054' } });
        expect(screen.getByText('Final amount differs from initial estimate')).toBeInTheDocument();
    });

    it('filters case type, status, and priority', () => {
        render(<App />);
        fireEvent.change(screen.getByRole('combobox', { name: 'Case type' }), { target: { value: 'Support' } });
        expect(screen.getByText('Unable to update phone number')).toBeInTheDocument();
        expect(screen.queryByText('Work marked complete before repair was finished')).not.toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Case status' }), { target: { value: 'OPEN' } });
        expect(screen.getByText('Cannot see provider replies')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Case priority' }), { target: { value: 'Low' } });
        expect(screen.getByText('Showing 1–0 of 0')).toBeInTheDocument();
    });

    it('shows an empty state and clears filters', () => {
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search support cases' }), { target: { value: 'not a real case' } });
        expect(screen.getByText('No cases match these filters')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getByText('Showing 1–6 of 10')).toBeInTheDocument();
    });

    it('shows the case timeline, evidence metadata, and participant context', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Case activity' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Evidence checklist' })).toBeInTheDocument();
        expect(screen.getByText('Tunde Ekanem')).toBeInTheDocument();
        expect(screen.getByText(/No files are attached/i)).toBeInTheDocument();
    });

    it('adds a temporary demo note and updates only local case status', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Add note (demo)' }));
        expect(screen.getByText(/Enter a note before adding it/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Add internal note (demo)'), { target: { value: 'Check provider response before closing.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add note (demo)' }));
        expect(screen.getByText('Check provider response before closing.')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Demo case status' }), { target: { value: 'RESOLVED' } });
        expect(screen.getByText(/Demo case status changed to “Resolved”/i)).toBeInTheDocument();
        expect(screen.getByText(/not sent to FixIt servers/i)).toBeInTheDocument();
    });

    it('paginates the sample case queue', () => {
        render(<App />);
        expect(screen.getByText('Showing 1–6 of 10')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 7–10 of 10')).toBeInTheDocument();
    });
});


describe('admin categories workspace', () => {
    beforeEach(() => { window.location.hash = '#categories'; });

    it('opens the service category workspace with sample records', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Service categories' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative sample data/i)).toBeInTheDocument();
        expect(screen.getAllByText('Plumbing').length).toBeGreaterThan(0);
    });

    it('searches categories and filters by active status', () => {
        render(<App />);
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search categories' }), { target: { value: 'painting' } });
        expect(screen.getByText('Painting')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Category status' }), { target: { value: 'ACTIVE' } });
        expect(screen.getByText('No categories match these filters')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(screen.getAllByText('Plumbing').length).toBeGreaterThan(0);
    });

    it('shows category details and example services', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Plumbing' })).toBeInTheDocument();
        expect(screen.getByText('Pipe repair')).toBeInTheDocument();
        expect(screen.getByText(/No customer discovery, provider listings/i)).toBeInTheDocument();
    });

    it('validates and creates a temporary demo category', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /Add category/i }));
        fireEvent.click(screen.getByRole('button', { name: 'Create demo category' }));
        expect(screen.getByText(/Enter both a category name and description/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Category name'), { target: { value: 'Home maintenance' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'General home maintenance services.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create demo category' }));
        expect(screen.getByRole('heading', { name: 'Home maintenance' })).toBeInTheDocument();
        expect(screen.getByText(/temporary browser state/i)).toBeInTheDocument();
    });

    it('prevents duplicate category names', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /Add category/i }));
        fireEvent.change(screen.getByLabelText('Category name'), { target: { value: 'plumbing' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Duplicate category attempt.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create demo category' }));
        expect(screen.getByText(/A category with this name already exists/i)).toBeInTheDocument();
    });

    it('edits and deactivates only the local demo category', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Edit category' }));
        fireEvent.change(screen.getByLabelText('Category name'), { target: { value: 'Home plumbing' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save demo changes' }));
        expect(screen.getByRole('heading', { name: 'Home plumbing' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Deactivate (demo)' }));
        expect(screen.getByText(/marked inactive/i)).toBeInTheDocument();
        expect(screen.getAllByText('Inactive', { selector: '.status-badge' }).length).toBeGreaterThan(0);
    });

    it('paginates category records', () => {
        render(<App />);
        expect(screen.getByText('Showing 1–6 of 10')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getByText('Showing 7–10 of 10')).toBeInTheDocument();
    });
});


describe('admin analytics workspace', () => {
    beforeEach(() => { window.location.hash = '#analytics'; });

    it('opens analytics with clearly identified sample figures', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
        expect(screen.getByText(/not live FixIt reporting/i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Job activity' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Job status breakdown' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Top service categories' })).toBeInTheDocument();
    });

    it('changes the reporting period and recalculates summary metrics', () => {
        render(<App />);
        expect(screen.getByText('491')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Reporting period' }), { target: { value: '7d' } });
        expect(screen.getByText('173')).toBeInTheDocument();
        expect(screen.getByText('105')).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox', { name: 'Reporting period' }), { target: { value: '90d' } });
        expect(screen.getByText('1289')).toBeInTheDocument();
    });

    it('labels estimated job value separately from revenue and payments', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Estimated job value' })).toBeInTheDocument();
        expect(screen.getByText(/Not revenue or payments/i)).toBeInTheDocument();
        expect(screen.getByText(/not provider earnings, agreed job prices, platform revenue/i)).toBeInTheDocument();
    });

    it('opens analytics from the admin navigation', () => {
        window.location.hash = '';
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Analytics' }));
        expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
    });
});


describe('admin settings workspace', () => {
    beforeEach(() => { window.location.hash = '#settings'; });

    it('opens settings with demo-only and read-only boundaries', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Admin profile' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Notification preferences' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Platform information' })).toBeInTheDocument();
        expect(screen.getByText(/temporary browser state/i)).toBeInTheDocument();
    });

    it('updates notification preferences and applies them only in the demo page', () => {
        render(<App />);
        const weeklySummary = screen.getByRole('checkbox', { name: /Weekly activity summary/i });
        expect(weeklySummary).not.toBeChecked();
        fireEvent.click(weeklySummary);
        expect(weeklySummary).toBeChecked();
        fireEvent.click(screen.getByRole('button', { name: 'Apply demo preferences' }));
        expect(screen.getByRole('status')).toHaveTextContent(/not been saved to FixIt servers/i);
    });

    it('changes regional preferences and resets demo values', () => {
        render(<App />);
        const timezone = screen.getByRole('combobox', { name: 'Time zone' });
        fireEvent.change(timezone, { target: { value: 'UTC' } });
        expect(timezone).toHaveValue('UTC');
        fireEvent.click(screen.getByRole('button', { name: 'Reset demo preferences' }));
        expect(timezone).toHaveValue('Africa/Lagos');
        expect(screen.getByRole('status')).toHaveTextContent(/reset to their defaults/i);
    });

    it('opens settings from admin navigation', () => {
        window.location.hash = '';
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
        expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    });
});


describe('admin account workspace', () => {
    beforeEach(() => { window.location.hash = '#account'; });

    it('opens the account page with clear demo and authentication boundaries', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: 'My account' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Edit profile' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Sign-in and security' })).toBeInTheDocument();
        expect(screen.getByText(/does not load an authenticated administrator profile/i)).toBeInTheDocument();
        expect(screen.getByText(/Password changes are managed by the authentication service/i)).toBeInTheDocument();
    });

    it('validates profile details and applies only temporary demo values', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Apply demo profile' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/Enter a display name/i);
        fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Workspace Admin' } });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'not-an-email' } });
        fireEvent.click(screen.getByRole('button', { name: 'Apply demo profile' }));
        expect(screen.getByRole('alert')).toHaveTextContent(/valid email address/i);
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'admin@example.com' } });
        fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '+2348000000000' } });
        fireEvent.click(screen.getByRole('button', { name: 'Apply demo profile' }));
        expect(screen.getByRole('heading', { name: 'Workspace Admin' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent(/not been sent to FixIt servers/i);
    });

    it('clears the temporary profile and opens workspace settings', () => {
        render(<App />);
        fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Workspace Admin' } });
        fireEvent.click(screen.getByRole('button', { name: 'Apply demo profile' }));
        fireEvent.click(screen.getByRole('button', { name: 'Clear demo profile' }));
        expect(screen.getByRole('heading', { name: 'Admin workspace' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent(/fields have been cleared/i);
        fireEvent.click(screen.getByRole('button', { name: /Open settings/i }));
        expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    });

    it('opens account from admin navigation', () => {
        window.location.hash = '';
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: 'Account' }));
        expect(screen.getByRole('heading', { name: 'My account' })).toBeInTheDocument();
    });
});
