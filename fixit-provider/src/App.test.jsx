import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App.jsx';
import { authApi } from './api/auth.js';

vi.mock('./api/auth.js', () => ({
    authApi: { getCurrentUser: vi.fn(), login: vi.fn(), logout: vi.fn() },
}));

const providerUser = { id: 'p1', name: 'Pat', role: 'provider' };

beforeEach(() => {
    vi.clearAllMocks();
    authApi.getCurrentUser.mockResolvedValue({ data: { user: providerUser } });
    authApi.login.mockResolvedValue({ data: { user: providerUser } });
});

afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', window.location.pathname);
});

describe('provider authentication entry', () => {
    it('restores a provider session before rendering the dashboard', async () => {
        render(<App />);
        expect(await screen.findByRole('heading', { name: /provider dashboard/i })).toBeInTheDocument();
        expect(authApi.getCurrentUser).toHaveBeenCalledOnce();
    });

    it('shows a dedicated provider login when no session exists', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No session'));
        render(<App />);
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(screen.getByText('SERVICE PROVIDER')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /log in as a customer/i })).toHaveAttribute('href', 'http://localhost:5173/');
        expect(screen.getByRole('link', { name: /back to fixit/i })).toHaveAttribute('href', 'http://localhost:5173/');
    });

    it('logs in with the provider API and opens the provider dashboard', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No session'));
        render(<App />);
        await screen.findByRole('heading', { name: 'Welcome back' });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'provider@example.test' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in to provider workspace' }));
        expect(await screen.findByRole('heading', { name: /provider dashboard/i })).toBeInTheDocument();
        expect(authApi.login).toHaveBeenCalledWith({ email: 'provider@example.test', password: 'secret' });
        expect(window.location.hash).toBe('#dashboard');
    });

    it('keeps workspace navigation accessible through the mobile menu control', async () => {
        render(<App />);
        await screen.findByRole('heading', { name: /provider dashboard/i });
        const menuButton = document.querySelector('.mobile-menu-button');
        expect(menuButton).not.toBeNull();
        expect(menuButton).toHaveAttribute('aria-label', 'Open navigation menu');
        expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(menuButton);
        expect(screen.getByRole('dialog', { name: 'Provider navigation' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }));
        expect(screen.queryByRole('dialog', { name: 'Provider navigation' })).not.toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('rejects a customer account from the provider login', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No session'));
        authApi.login.mockResolvedValueOnce({ data: { user: { id: 'c1', role: 'customer' } } });
        render(<App />);
        await screen.findByRole('heading', { name: 'Welcome back' });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'customer@example.test' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in to provider workspace' }));
        expect(await screen.findByRole('alert')).toHaveTextContent(/not a provider account/i);
        expect(screen.queryByRole('heading', { name: /provider dashboard/i })).not.toBeInTheDocument();
    });
});
