import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';

const pageLabels = [
    'Dashboard',
    'My Profile',
    'My Services',
    'Availability',
    'Available Jobs',
    'Job Details',
    'My Jobs',
    'Messages',
    'Earnings',
    'Reviews',
    'Settings',
];

afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', window.location.pathname);
});

describe('provider workspace navigation', () => {
    it('renders the provider dashboard by default', () => {
        render(<App />);

        expect(screen.getByRole('heading', { name: /good morning, provider/i })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });

    it.each(pageLabels)('opens the %s screen and marks it active', (page) => {
        render(<App />);

        fireEvent.click(screen.getByText(page, { selector: 'span' }));

        if (page === 'Dashboard') {
            expect(screen.getByRole('heading', { name: /good morning, provider/i })).toBeInTheDocument();
        } else {
            expect(screen.getByRole('heading', { name: page, level: 1 })).toBeInTheDocument();
        }

        expect(screen.getByText(page, { selector: 'span' }).closest('button'))
            .toHaveAttribute('aria-current', 'page');
    });

    it('opens the mobile navigation and closes it after a section is selected', () => {
        render(<App />);

        const menuButton = screen.getByLabelText(/open navigation menu/i);
        fireEvent.click(menuButton);

        expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByText('My Profile', { selector: 'span' }));

        expect(screen.getByRole('heading', { name: 'My Profile', level: 1 })).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows a not-found screen for an unknown hash route', () => {
        render(<App />);

        window.history.replaceState({}, '', '#not-a-real-page');
        fireEvent(window, new Event('hashchange'));

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    });
});
