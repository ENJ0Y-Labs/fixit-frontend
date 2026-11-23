import { useEffect, useRef, useState } from 'react';
import { authApi } from './api/auth.js';
import { ApiError } from './api/client.js';
import './styles/pages/auth.css';

const protectedRoutes = ['my-jobs', 'post-job', 'job-details', 'payment', 'review', 'account'];
const getRoute = () => window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'landing';
function setRoute(route, replace = false) {
    const url = window.location.pathname + window.location.search + '#' + route;
    if (replace) window.history.replaceState(window.history.state, '', url);
    else window.history.pushState(window.history.state, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
}
function getUser(payload) {
    const value = payload?.data ?? payload;
    return value?.user ?? value?.customer ?? value ?? null;
}
function AuthForm({ mode, onModeChange, onAuthenticated, onBack }) {
    const [values, setValues] = useState({ name: '', phone: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isSignup = mode === 'signup';
    function update(event) { setValues((current) => ({ ...current, [event.target.name]: event.target.value })); setError(''); setNotice(''); }
    async function submit(event) {
        event.preventDefault(); setError(''); setNotice('');
        const email = values.email.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return; }
        if (!values.password) { setError('Enter your password.'); return; }
        if (isSignup && (!values.name.trim() || !values.phone.trim())) { setError('Enter your full name and phone number.'); return; }
        setSubmitting(true);
        try {
            if (isSignup) {
                await authApi.register({ name: values.name.trim(), email, phone: values.phone.trim(), password: values.password, role: 'customer' });
                setNotice('Your account request was submitted. Sign in once your account is ready.');
                onModeChange('login');
            } else {
                const payload = await authApi.login({ email, password: values.password });
                const value = payload?.data ?? payload;
                const user = value?.user ?? value?.customer ?? value;
                if (!user || typeof user !== 'object') throw new Error('The server did not return an authenticated customer account.');
                onAuthenticated(user);
            }
        } catch (requestError) {
            setError(requestError instanceof ApiError ? requestError.message : requestError?.message || 'We could not complete that request. Please try again.');
        } finally { setSubmitting(false); }
    }
    return <main className="customer-auth-page"><section className="customer-auth-card" aria-labelledby="auth-title">
        <button className="customer-auth-back" type="button" onClick={onBack}><i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to FixIt</button>
        <a className="customer-auth-brand" href="#landing" aria-label="FixIt home"><img src="/brand/logo.png" alt="" /><span>FixIt</span></a>
        <p className="customer-auth-eyebrow">CUSTOMER ACCOUNT</p><h1 id="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="customer-auth-description">{isSignup ? 'Create an account to request trusted help for your home.' : 'Sign in to book services and manage your requests.'}</p>
        {notice && <p className="customer-auth-notice" role="status">{notice}</p>}{error && <p className="customer-auth-error" role="alert">{error}</p>}
        <form onSubmit={submit} noValidate>
            {isSignup && <><label htmlFor="auth-name">Full name</label><input id="auth-name" name="name" autoComplete="name" value={values.name} onChange={update} required /><label htmlFor="auth-phone">Phone number</label><input id="auth-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update} required /></>}
            <label htmlFor="auth-email">Email address</label><input id="auth-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update} required />
            <label htmlFor="auth-password">Password</label><input id="auth-password" name="password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={update} required />
            <button className="customer-auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="customer-auth-switch">{isSignup ? 'Already have an account?' : 'New to FixIt?'}{' '}<button type="button" onClick={() => onModeChange(isSignup ? 'login' : 'signup')}>{isSignup ? 'Sign in' : 'Create an account'}</button></p>
        <p className="customer-auth-footnote">You can explore FixIt without an account. Sign in when you are ready to request a service.</p>
    </section></main>;
}
export default function AuthGate({ children }) {
    const [status, setStatus] = useState('checking');
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState(() => getRoute() === 'signup' ? 'signup' : 'login');
    const [showAuth, setShowAuth] = useState(['login', 'signup'].includes(getRoute()));
    const returnToRef = useRef('landing');
    const pendingAction = useRef(null);
    useEffect(() => {
        let active = true;
        const syncRoute = () => { const route = getRoute(); if (route === 'login' || route === 'signup') { setMode(route); setShowAuth(true); } else { setShowAuth(false); } };
        window.addEventListener('popstate', syncRoute); window.addEventListener('hashchange', syncRoute);
        authApi.getCurrentUser().then((response) => {
            if (!active) return;
            const currentUser = getUser(response);
            if (!currentUser || typeof currentUser !== 'object') throw new Error('Session response did not contain a user.');
            setUser(currentUser); setStatus('authenticated');
            if (['login', 'signup'].includes(getRoute()) || pendingAction.current) {
                setShowAuth(false); setRoute(returnToRef.current, true);
                const action = pendingAction.current; pendingAction.current = null; action?.();
            }
        }).catch(() => {
            if (!active) return;
            setStatus('unauthenticated');
            const route = getRoute();
            if (protectedRoutes.includes(route)) { returnToRef.current = route; setMode('login'); setShowAuth(true); setRoute('login', true); }
            else if (pendingAction.current) { setMode('login'); setShowAuth(true); setRoute('login', true); }
        });
        return () => { active = false; window.removeEventListener('popstate', syncRoute); window.removeEventListener('hashchange', syncRoute); };
    }, []);
    function openAuth(nextMode = 'login', destination = 'landing') { returnToRef.current = destination || 'landing'; setMode(nextMode); setShowAuth(true); setRoute(nextMode); }
    function requireAuth({ returnTo = 'marketplace', action } = {}) {
        if (status === 'authenticated') { action?.(); return; }
        returnToRef.current = returnTo; pendingAction.current = action || null;
        if (status !== 'checking') openAuth('login', returnTo);
    }
    async function logout() {
        try { await authApi.logout(); } catch { /* Clear local access even if the server cannot confirm logout. */ }
        setUser(null); setStatus('unauthenticated'); setShowAuth(false); returnToRef.current = 'landing'; setRoute('landing', true);
    }
    function completeAuthentication(nextUser) {
        setUser(nextUser); setStatus('authenticated'); setShowAuth(false); setRoute(returnToRef.current || 'landing', true);
        const action = pendingAction.current; pendingAction.current = null; action?.();
    }
    function changeMode(nextMode) { setMode(nextMode); setShowAuth(true); setRoute(nextMode); }
    // Keep public discovery visible while session restoration runs in the background.
    if (showAuth && status !== 'checking' && status !== 'authenticated') return <AuthForm mode={mode} onModeChange={changeMode} onAuthenticated={completeAuthentication} onBack={() => { setShowAuth(false); setRoute(returnToRef.current || 'landing', true); }} />;
    // Render-prop callbacks receive event handlers that close over auth refs.
    // eslint-disable-next-line react-hooks/refs
    return children({ user, authStatus: status, onLogout: logout, openAuth, requireAuth });
}
