import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('provider application layout', () => {
    it('renders the provider dashboard', () => {
        render(<App />);

        expect(screen.getByRole('heading', { name: /good morning, provider/i })).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    });

    it('updates the active navigation item when a section is selected', () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: /available jobs/i, hidden: true }));

        expect(screen.getByRole('heading', { name: /^available jobs$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /available jobs/i, hidden: true })).toHaveAttribute('aria-current', 'page');
    });

    it('opens the mobile navigation and closes it after a section is selected', () => {
        render(<App />);

        // jsdom does not evaluate responsive CSS media queries, so include the desktop-hidden mobile trigger.
        const menuButton = screen.getByLabelText(/open navigation menu/i);
        fireEvent.click(menuButton);

        expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByText('My Profile'));

        expect(screen.getByRole('heading', { name: /my profile/i })).toBeInTheDocument();
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
});
