import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthGate from './AuthGate.jsx';
import { authApi } from './api/auth.js';

vi.mock('./api/auth.js', () => ({
    authApi: {
        getCurrentUser: vi.fn(),
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
    },
}));

function renderGate() {
    return render(
        <AuthGate>
            {({ user, onLogout }) => (
                <main>
                    <h1>Protected customer workspace</h1>
                    <p>{user.name}</p>
                    <button type="button" onClick={onLogout}>Workspace sign out</button>
                </main>
            )}
        </AuthGate>,
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, '', '/');
    authApi.getCurrentUser.mockResolvedValue({ data: { user: { id: 'customer-1', name: 'Ada Customer' } } });
    authApi.login.mockResolvedValue({ data: { user: { id: 'customer-1', name: 'Ada Customer' } } });
    authApi.register.mockResolvedValue({ data: { message: 'Created' } });
    authApi.logout.mockResolvedValue({ data: null });
});

afterEach(() => {
    cleanup();
    window.history.replaceState(null, '', '/');
});

describe('customer authentication gate', () => {
    it('restores an existing backend session before rendering protected content', async () => {
        renderGate();
        expect(await screen.findByRole('heading', { name: 'Protected customer workspace' })).toBeInTheDocument();
        expect(authApi.getCurrentUser).toHaveBeenCalledOnce();
    });

    it('preserves a protected deep link when an existing session is restored', async () => {
        window.history.replaceState(null, '', '/#my-jobs');
        renderGate();
        expect(await screen.findByRole('heading', { name: 'Protected customer workspace' })).toBeInTheDocument();
        expect(window.location.hash).toBe('#my-jobs');
    });

    it('keeps protected content hidden when the session is missing', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('Not signed in'));
        renderGate();
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Protected customer workspace' })).not.toBeInTheDocument();
    });

    it('submits login credentials and opens the protected workspace after success', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No active session'));
        window.history.replaceState(null, '', '/#my-jobs');
        renderGate();
        await screen.findByRole('heading', { name: 'Welcome back' });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@example.test' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'correct-horse' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
        expect(await screen.findByRole('heading', { name: 'Protected customer workspace' })).toBeInTheDocument();
        expect(authApi.login).toHaveBeenCalledWith({ email: 'ada@example.test', password: 'correct-horse' });
        expect(window.location.hash).toBe('#my-jobs');
    });

    it('rejects malformed email input before making a backend request', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No active session'));
        renderGate();
        await screen.findByRole('heading', { name: 'Welcome back' });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'not-an-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid email address.');
        expect(authApi.login).not.toHaveBeenCalled();
    });

    it('shows an accessible error when login fails', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No active session'));
        authApi.login.mockRejectedValueOnce(new Error('Email or password is incorrect.'));
        renderGate();
        await screen.findByRole('heading', { name: 'Welcome back' });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'bad@example.test' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
        expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
        expect(screen.queryByRole('heading', { name: 'Protected customer workspace' })).not.toBeInTheDocument();
    });

    it('submits customer registration with the customer role', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No active session'));
        window.history.replaceState(null, '', '/#signup');
        renderGate();
        await screen.findByRole('heading', { name: 'Create your account' });
        fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada Customer' } });
        fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '+2348012345678' } });
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@example.test' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'correct-horse' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
        await waitFor(() => expect(authApi.register).toHaveBeenCalledWith({
            name: 'Ada Customer',
            phone: '+2348012345678',
            email: 'ada@example.test',
            password: 'correct-horse',
            role: 'customer',
        }));
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    });

    it('invalidates the backend session and clears local access on logout', async () => {
        renderGate();
        fireEvent.click(await screen.findByRole('button', { name: 'Workspace sign out' }));
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(authApi.logout).toHaveBeenCalledOnce();
        expect(screen.queryByRole('heading', { name: 'Protected customer workspace' })).not.toBeInTheDocument();
    });

    it('clears local access even when the logout request fails', async () => {
        authApi.logout.mockRejectedValueOnce(new Error('Server unavailable'));
        renderGate();
        fireEvent.click(await screen.findByRole('button', { name: 'Workspace sign out' }));
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveTextContent('Server unavailable');
    });

    it('shows an unknown route login attempt without exposing protected content', async () => {
        authApi.getCurrentUser.mockRejectedValueOnce(new Error('No active session'));
        window.history.replaceState(null, '', '/#this-route-does-not-exist');
        renderGate();
        expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
        expect(window.location.hash).toBe('#this-route-does-not-exist');
    });
});
