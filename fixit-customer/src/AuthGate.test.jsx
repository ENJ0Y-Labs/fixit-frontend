import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthGate from './AuthGate.jsx';
import { authApi } from './api/auth.js';
vi.mock('./api/auth.js', () => ({ authApi: { getCurrentUser: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn() } }));
beforeEach(() => { vi.clearAllMocks(); window.history.replaceState(null, '', '/'); authApi.getCurrentUser.mockRejectedValue(new Error('No session')); authApi.login.mockResolvedValue({ data: { user: { id: 'c1', name: 'Ada' } } }); authApi.register.mockResolvedValue({}); authApi.logout.mockResolvedValue({}); });
afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });
const PublicContent = ({ user, requireAuth }) => <main><h1>Public marketplace</h1>{user && <p>{user.name}</p>}<button onClick={() => requireAuth({ returnTo: 'my-jobs' })}>Protected action</button></main>;
describe('guest-first authentication', () => {
 it('renders public discovery while restoring a session', async () => { authApi.getCurrentUser.mockResolvedValueOnce({ data: { user: { id: 'c1', name: 'Ada' } } }); render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>); expect(screen.getByRole('heading', { name: 'Public marketplace' })).toBeInTheDocument(); expect(await screen.findByText('Ada')).toBeInTheDocument(); });
 it('keeps public discovery available without a session', async () => { render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>); expect(screen.getByRole('heading', { name: 'Public marketplace' })).toBeInTheDocument(); await waitFor(() => expect(authApi.getCurrentUser).toHaveBeenCalledOnce()); expect(screen.queryByRole('heading', { name: 'Welcome back' })).not.toBeInTheDocument(); });
 it('requires login for a protected deep link', async () => { window.history.replaceState(null, '', '/#my-jobs'); render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>); expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument(); expect(window.location.hash).toBe('#login'); });
 it('returns to the protected route after successful login', async () => { window.history.replaceState(null, '', '/#my-jobs'); render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>); await screen.findByRole('heading', { name: 'Welcome back' }); fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@example.test' } }); fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } }); fireEvent.click(screen.getByRole('button', { name: 'Sign in' })); expect(await screen.findByText('Ada')).toBeInTheDocument(); expect(window.location.hash).toBe('#my-jobs'); });
 it('resumes a requested action after login', async () => { const action = vi.fn(); render(<AuthGate>{({ requireAuth }) => <button onClick={() => requireAuth({ returnTo: 'marketplace', action })}>Save provider</button>}</AuthGate>); fireEvent.click(screen.getByRole('button', { name: 'Save provider' })); await screen.findByRole('heading', { name: 'Welcome back' }); fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@example.test' } }); fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } }); fireEvent.click(screen.getByRole('button', { name: 'Sign in' })); await waitFor(() => expect(action).toHaveBeenCalledOnce()); expect(window.location.hash).toBe('#marketplace'); });
 it('places the back control outside the form card and offers a separate provider sign-in', async () => {
  window.history.replaceState(null, '', '/#login');
  render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>);
  await screen.findByRole('heading', { name: 'Welcome back' });
  const back = screen.getByRole('button', { name: /back to fixit/i });
  expect(back.closest('.customer-auth-card')).toBeNull();
  expect(back.parentElement).toHaveClass('customer-auth-back-wrap');
  expect(screen.getByRole('link', { name: /log in as a provider/i })).toHaveAttribute('href', '/provider/');
 });
 it('returns to the public marketplace when the floating back control is used', async () => {
  window.history.replaceState(null, '', '/#login');
  render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>);
  await screen.findByRole('heading', { name: 'Welcome back' });
  fireEvent.click(screen.getByRole('button', { name: /back to fixit/i }));
  expect(await screen.findByRole('heading', { name: 'Public marketplace' })).toBeInTheDocument();
  expect(window.location.hash).toBe('#landing');
 });
 it('validates malformed email before calling login', async () => { window.history.replaceState(null, '', '/#login'); render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>); await screen.findByRole('heading', { name: 'Welcome back' }); fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'bad' } }); fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } }); fireEvent.click(screen.getByRole('button', { name: 'Sign in' })); expect(await screen.findByRole('alert')).toHaveTextContent('Enter a valid email address.'); expect(authApi.login).not.toHaveBeenCalled(); });
 it('registers an account with the customer role', async () => { window.history.replaceState(null, '', '/#signup'); render(<AuthGate>{(props) => <PublicContent {...props} />}</AuthGate>); await screen.findByRole('heading', { name: 'Create your account' }); fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada' } }); fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '+2348012345678' } }); fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'ada@example.test' } }); fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } }); fireEvent.click(screen.getByRole('button', { name: 'Create account' })); await waitFor(() => expect(authApi.register).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.test', phone: '+2348012345678', password: 'secret', role: 'customer' })); expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument(); });
});
