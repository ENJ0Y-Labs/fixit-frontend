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

        fireEvent.click(screen.getByRole('button', { name: /available jobs/i }));

        expect(screen.getByRole('heading', { name: /available jobs/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /available jobs/i })).toHaveAttribute('aria-current', 'page');
    });

    it('opens the mobile navigation and closes it after a section is selected', () => {
        render(<App />);

        const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
        fireEvent.click(menuButton);

        expect(menuButton).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByRole('button', { name: /my profile/i }));

        expect(screen.getByRole('heading', { name: /my profile/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveAttribute('aria-expanded', 'false');
    });
});
