import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ServicesAvailabilityPage from './ServicesAvailabilityPage.jsx';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe('provider service management', () => {
    it('adds, edits, and removes permitted services', () => {
        render(<ServicesAvailabilityPage />);
        fireEvent.change(screen.getByLabelText('Add a permitted service'), { target: { value: 'Cleaning' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add service' }));
        expect(screen.getAllByLabelText('Service')).toHaveLength(2);
        expect(screen.getByRole('heading', { name: 'Cleaning' })).toBeInTheDocument();

        fireEvent.change(screen.getAllByLabelText('Description')[1], { target: { value: 'Home cleaning and tidy-up services.' } });
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Remove Cleaning' }));
        expect(screen.queryByRole('heading', { name: 'Cleaning' })).not.toBeInTheDocument();
    });

    it('rejects a zero or negative price and retains the entered values', () => {
        render(<ServicesAvailabilityPage />);
        fireEvent.change(screen.getByLabelText('Price (₦, optional)'), { target: { value: '-25' } });
        fireEvent.click(screen.getByRole('button', { name: 'Review and save' }));
        expect(screen.getByText('Enter a valid non-negative price.')).toBeInTheDocument();
        expect(screen.getByLabelText('Price (₦, optional)')).toHaveValue(-25);
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });

    it('requires a description for a newly added service', () => {
        render(<ServicesAvailabilityPage />);
        fireEvent.change(screen.getByLabelText('Add a permitted service'), { target: { value: 'Carpentry' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add service' }));
        fireEvent.click(screen.getByRole('button', { name: 'Review and save' }));
        expect(screen.getByText('Add a short description.')).toBeInTheDocument();
    });

    it('does not claim server persistence after confirming service changes', () => {
        render(<ServicesAvailabilityPage />);
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Tap repairs, leak detection, and pipe maintenance.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Review and save' }));
        expect(screen.getByRole('status')).toHaveTextContent('not been saved to a server');
        expect(screen.getByText('No unsaved changes')).toBeInTheDocument();
    });

    it('can discard unsaved service changes', () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        render(<ServicesAvailabilityPage />);
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Changed description for testing unsaved edits.' } });
        fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
        expect(screen.getByLabelText('Description')).toHaveValue('Tap repairs, leak detection, and basic pipe maintenance.');
        expect(screen.getByRole('status')).toHaveTextContent('discarded');
    });
});

describe('provider availability management', () => {
    it('validates that end time is later than start time', () => {
        render(<ServicesAvailabilityPage section="Availability" />);
        fireEvent.change(document.getElementById('availability-end-Monday'), { target: { value: '08:00' } });
        fireEvent.click(screen.getByRole('button', { name: 'Review and save' }));
        expect(screen.getByText('End time must be later than start time.')).toBeInTheDocument();
        expect(document.getElementById('availability-end-Monday')).toHaveValue('08:00');
    });

    it('requires at least one working day when available', () => {
        render(<ServicesAvailabilityPage section="Availability" />);
        screen.getAllByRole('checkbox').filter((checkbox) => checkbox.closest('.schedule-day')).forEach((checkbox) => {
            if (checkbox.checked) fireEvent.click(checkbox);
        });
        fireEvent.click(screen.getByRole('button', { name: 'Review and save' }));
        expect(screen.getByText('Select at least one working day, or mark yourself unavailable.')).toBeInTheDocument();
    });

    it('disables schedule controls and clearly indicates unavailable state', () => {
        render(<ServicesAvailabilityPage section="Availability" />);
        fireEvent.click(screen.getByRole('checkbox', { name: 'Available' }));
        expect(screen.getByRole('heading', { name: 'Unavailable for new work' })).toBeInTheDocument();
        expect(screen.getByText('Working-hour controls are disabled while you are unavailable.')).toBeInTheDocument();
        expect(document.getElementById('availability-Monday')).toBeDisabled();
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });

    it('confirms local schedule state without falsely claiming a server save', () => {
        render(<ServicesAvailabilityPage section="Availability" />);
        fireEvent.change(document.getElementById('availability-Monday'), { target: { value: '10:00' } });
        fireEvent.click(screen.getByRole('button', { name: 'Review and save' }));
        expect(screen.getByRole('status')).toHaveTextContent('not been saved to a server');
        expect(screen.getByText('No unsaved changes')).toBeInTheDocument();
    });
});
