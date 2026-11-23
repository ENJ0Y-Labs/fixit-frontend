import { useEffect, useState } from 'react';
import { authApi } from './api/auth.js';
import { ApiError } from './api/client.js';
import './styles/pages/auth.css';

function unwrap(payload) {
    return payload?.data ?? payload;
}

function getUser(payload) {
    const value = unwrap(payload);
    return value?.user ?? value?.customer ?? value ?? null;
}

function getAuthRouteMode() {
    const route = window.location.hash.replace(/^#\\/?/, '').split('?')[0];
    return route === 'signup' || route === 'login' ? route : null;
}

function routeMode() {
    return getAuthRouteMode() || 'login';
}

function setRoute(mode, replace = false) {
    const url = `${window.location.pathname}${window.location.search}#/${mode}`;
    if (replace) window.history.replaceState(window.history.state, '', url);
    else window.history.pushState(window.history.state, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
}

function AuthForm({ mode, onModeChange, onAuthenticated }) {
    const [values, setValues] = useState({ name: '', phone: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isSignup = mode === 'signup';

    function update(event) {
        setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
        setError('');
        setNotice('');
    }

    async function submit(event) {
        event.preventDefault();
        setError('');
        setNotice('');
        const email = values.email.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Enter a valid email address.');
            return;
        }
        if (!values.password) {
            setError('Enter your password.');
            return;
        }
        if (isSignup && (!values.name.trim() || !values.phone.trim())) {
            setError('Enter your full name and phone number.');
            return;
        }
        setSubmitting(true);
        try {
            if (isSignup) {
                await authApi.register({
                    name: values.name.trim(),
                    email,
                    phone: values.phone.trim(),
                    password: values.password,
                    role: 'customer',
                });
                setNotice('Your account request was submitted. Sign in once your account is ready.');
                setRoute('login');
                onModeChange('login');
            } else {
                const response = await authApi.login({
                    email: values.email.trim(),
                    password: values.password,
                });
                const user = getUser(response);
                if (!user || typeof user !== 'object') {
                    throw new Error('The server did not return an authenticated customer account.');
                }
                onAuthenticated(user);
            }
        } catch (requestError) {
            setError(requestError instanceof ApiError
                ? requestError.message
                : requestError?.message || 'We could not complete that request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="customer-auth-page">
            <section className="customer-auth-card" aria-labelledby="auth-title">
                <a className="customer-auth-brand" href="#/login" aria-label="FixIt customer home">
                    <img src="/brand/logo.png" alt="" />
                    <span>FixIt</span>
                </a>
                <p className="customer-auth-eyebrow">CUSTOMER ACCOUNT</p>
                <h1 id="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
                <p className="customer-auth-description">
                    {isSignup ? 'Create an account to find trusted help for your home.' : 'Sign in to manage your home services and requests.'}
                </p>
                {notice && <p className="customer-auth-notice" role="status">{notice}</p>}
                {error && <p className="customer-auth-error" role="alert">{error}</p>}
                <form onSubmit={submit} noValidate>
                    {isSignup && <>
                        <label htmlFor="auth-name">Full name</label>
                        <input id="auth-name" name="name" autoComplete="name" value={values.name} onChange={update} required />
                        <label htmlFor="auth-phone">Phone number</label>
                        <input id="auth-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update} required />
                    </>}
                    <label htmlFor="auth-email">Email address</label>
                    <input id="auth-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update} required />
                    <label htmlFor="auth-password">Password</label>
                    <input id="auth-password" name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={update} required />
                    <button className="customer-auth-submit" type="submit" disabled={submitting}>
                        {submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
                    </button>
                </form>
                <p className="customer-auth-switch">
                    {isSignup ? 'Already have an account?' : 'New to FixIt?'}{' '}
                    <button type="button" onClick={() => onModeChange(isSignup ? 'login' : 'signup')}>
                        {isSignup ? 'Sign in' : 'Create an account'}
                    </button>
                </p>
                <p className="customer-auth-footnote">Secure sign-in is provided by the FixIt backend.</p>
            </section>
        </main>
    );
}

export default function AuthGate({ children }) {
    const [status, setStatus] = useState('checking');
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(routeMode);
    const [sessionError, setSessionError] = useState('');

    useEffect(() => {
        let active = true;
        const syncMode = () => setMode(routeMode());
        window.addEventListener('popstate', syncMode);
        window.addEventListener('hashchange', syncMode);
        authApi.getCurrentUser()
            .then((response) => {
                if (!active) return;
                const currentUser = getUser(response);
                if (!currentUser || typeof currentUser !== 'object') throw new Error('The session response did not contain a user.');
                setUser(currentUser);
                setStatus('authenticated');
            })
            .catch((error) => {
                if (!active) return;
                setSessionError(error?.message || 'Your session could not be restored. Sign in to continue.');
                setStatus('unauthenticated');
            });
        return () => {
            active = false;
            window.removeEventListener('popstate', syncMode);
            window.removeEventListener('hashchange', syncMode);
        };
    }, []);

    useEffect(() => {
        if (status === 'authenticated' && getAuthRouteMode()) {
            setRoute('home', true);
        }
    }, [status]);

    async function logout() {
        let logoutError = '';
        try {
            await authApi.logout();
        } catch (error) {
            logoutError = error?.message || 'The server could not confirm logout.';
        } finally {
            setUser(null);
            setStatus('unauthenticated');
            setSessionError(logoutError);
            setRoute('login', true);
        }
    }

    if (status === 'checking') {
        return <main className="customer-auth-loading" role="status">Checking your FixIt session…</main>;
    }
    if (status === 'authenticated') {
        return children({ user, onLogout: logout });
    }
    return (
        <>
            {sessionError && <p className="customer-auth-session-message" role="status">{sessionError}</p>}
            <AuthForm
                mode={mode}
                onModeChange={(nextMode) => { setMode(nextMode); setRoute(nextMode); setSessionError(''); }}
                onAuthenticated={(nextUser) => { setUser(nextUser); setStatus('authenticated'); }}
            />
        </>
    );
}
