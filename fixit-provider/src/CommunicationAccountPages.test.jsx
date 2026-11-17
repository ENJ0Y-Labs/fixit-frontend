import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EarningsPage from './EarningsPage.jsx';
import { calculateEarnings, formatNaira } from './earningsUtils.js';
import ReviewsPage from './ReviewsPage.jsx';
import SettingsPage from './SettingsPage.jsx';

afterEach(() => cleanup());
describe('provider earnings', () => {
    it('calculates each earnings category separately and ignores invalid records', () => {
        const totals = calculateEarnings([{ amount: 12000, amountType: 'estimated' }, { amount: 25000, amountType: 'agreed' }, { amount: 10000, amountType: 'paid' }, { amount: -500, amountType: 'paid' }, { amount: 'not money', amountType: 'paid' }, { amount: 9000, amountType: 'pending' }]);
        expect(totals).toEqual({ estimated: 12000, agreed: 25000, paid: 10000 });
        expect(formatNaira(25000)).toContain('25,000');
        expect(formatNaira('invalid')).toBe('Not available');
    });
    it('states payouts are unavailable when the feature is not connected', () => {
        render(<EarningsPage />);
        expect(screen.getByRole('heading', { name: 'Payouts are unavailable' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Earnings data is not connected' })).toBeInTheDocument();
    });
    it('shows an empty payment history without inventing figures', () => {
        render(<EarningsPage dataState="populated" records={[]} />);
        expect(screen.getByRole('heading', { name: 'No earnings records' })).toBeInTheDocument();
        expect(screen.getAllByText(/₦0/)).toHaveLength(3);
    });
});

describe('provider reviews', () => {
    it('shows the review empty state', () => {
        render(<ReviewsPage dataState="populated" reviews={[]} />);
        expect(screen.getByRole('heading', { name: 'No reviews yet' })).toBeInTheDocument();
    });
});

describe('provider settings', () => {
    const persistedSettings = { emailNotifications: true, messageNotifications: true, jobNotifications: true, marketingEmails: false, language: 'en-NG' };
    it('distinguishes unsaved edits and allows them to be discarded', async () => {
        render(<SettingsPage persistedSettings={persistedSettings} onSaveSettings={vi.fn()} />);
        const checkbox = screen.getByRole('checkbox', { name: /email notifications/i });
        await waitFor(() => expect(screen.getByText('Matches saved settings')).toBeInTheDocument());
        fireEvent.click(checkbox);
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
        expect(checkbox).toBeChecked();
        expect(screen.getByText('Matches saved settings')).toBeInTheDocument();
    });
    it('marks settings saved only after the callback confirms persistence', async () => {
        const onSaveSettings = vi.fn().mockResolvedValue({ saved: true, settings: { ...persistedSettings, emailNotifications: false } });
        render(<SettingsPage persistedSettings={persistedSettings} onSaveSettings={onSaveSettings} />);
        await waitFor(() => expect(screen.getByText('Matches saved settings')).toBeInTheDocument());
        fireEvent.click(screen.getByRole('checkbox', { name: /email notifications/i }));
        fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
        expect(await screen.findByRole('status')).toHaveTextContent(/saved and confirmed by the server/i);
        expect(screen.getByText('Matches saved settings')).toBeInTheDocument();
    });
    it('keeps failed changes unsaved', async () => {
        render(<SettingsPage persistedSettings={persistedSettings} onSaveSettings={vi.fn().mockRejectedValue(new Error('Save failed'))} />);
        await waitFor(() => expect(screen.getByText('Matches saved settings')).toBeInTheDocument());
        fireEvent.click(screen.getByRole('checkbox', { name: /email notifications/i }));
        fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('Save failed');
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });
});