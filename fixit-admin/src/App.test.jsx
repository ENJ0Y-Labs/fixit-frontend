import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('FixIt admin workspace', () => {
    it('renders the admin dashboard and identifies sample data', () => {
        render(<App />);

        expect(screen.getByRole('heading', { name: 'Platform overview' })).toBeInTheDocument();
        expect(screen.getByText(/illustrative sample figures/i)).toBeInTheDocument();
    });

    it('opens the selected workspace section', () => {
        render(<App />);

        fireEvent.click(screen.getByRole('button', { name: /providers/i }));
        expect(screen.getByRole('heading', { name: 'Providers' })).toBeInTheDocument();
    });

    it('opens and closes mobile navigation', () => {
        render(<App />);

        const openButton = screen.getByRole('button', { name: 'Open navigation menu' });
        fireEvent.click(openButton);
        expect(openButton).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }));
        expect(openButton).toHaveAttribute('aria-expanded', 'false');
    });
});
