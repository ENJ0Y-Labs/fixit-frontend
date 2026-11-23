import { useEffect, useRef, useState } from 'react';
import './App.css';
import { FixitAsyncBoundary } from './FixitAsyncBoundary.jsx';
import { authApi } from './api/auth.js';
import { ApiError } from './api/client.js';
import { clearDemoSession, createDemoUser, isDemoAuthEnabled, isDemoCredentials, readDemoSession, writeDemoSession } from '../../shared/demo-auth.js';

import DashboardPage from './DashboardPage.jsx';
import AvailableJobsPage from './AvailableJobsPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import ServicesAvailabilityPage from './ServicesAvailabilityPage.jsx';
import MyJobsPage from './MyJobsPage.jsx';
import EarningsPage from './EarningsPage.jsx';
import ReviewsPage from './ReviewsPage.jsx';
import SettingsPage from './SettingsPage.jsx';

const customerAppUrl = import.meta.env.VITE_CUSTOMER_APP_URL || 'http://localhost:5173/';
const navigation = [
    { label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
    { label: 'My Profile', icon: 'fa-solid fa-user' },
    { label: 'My Services', icon: 'fa-solid fa-toolbox' },
    { label: 'Availability', icon: 'fa-regular fa-calendar-check' },
    { label: 'Available Jobs', icon: 'fa-solid fa-magnifying-glass' },
    { label: 'Job Details', icon: 'fa-solid fa-clipboard-list' },
    { label: 'My Jobs', icon: 'fa-solid fa-briefcase' },
    { label: 'Earnings', icon: 'fa-solid fa-naira-sign' },
    { label: 'Reviews', icon: 'fa-solid fa-star' },
];

function resolvePage(hash) {
    const slug = hash.replace(/^#/, '').trim().toLowerCase();
    if (!slug || slug === 'dashboard') return 'Dashboard';
    const pages = [...navigation, { label: 'Settings', icon: 'fa-solid fa-gear' }];
    return pages.find((page) => page.label.toLowerCase().replace(/\s+/g, '-') === slug)?.label ?? 'Not found';
}

function getUser(payload) {
    const value = payload?.data ?? payload;
    return value?.user ?? value?.provider ?? value ?? null;
}

function ProviderAuth({ onAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setError('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Enter a valid email address.');
            return;
        }
        if (!password) {
            setError('Enter your password.');
            return;
        }
        setSubmitting(true);
        try {
            if (isDemoAuthEnabled() && isDemoCredentials(email, password)) {
                const demoUser = createDemoUser('provider');
                writeDemoSession(demoUser);
                onAuthenticated(demoUser);
                return;
            }
            const user = getUser(await authApi.login({ email: email.trim(), password }));
            if (!user || typeof user !== 'object') throw new Error('The server did not return an authenticated provider account.');
            const role = String(user.role ?? user.accountType ?? '').toLowerCase();
            if (role && !['provider', 'service_provider'].includes(role)) {
                throw new Error('This is not a provider account. Use the customer sign-in instead.');
            }
            onAuthenticated(user);
        } catch (requestError) {
            setError(requestError instanceof ApiError ? requestError.message : requestError?.message || 'We could not sign you in. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="provider-auth-page">
            <div className="provider-auth-back-wrap">
                <a className="provider-auth-back" href={customerAppUrl}><i className="fa-solid fa-arrow-left" aria-hidden="true" />Back to FixIt</a>
            </div>
            <section className="provider-auth-card" aria-labelledby="provider-auth-title">
                <a className="provider-auth-brand" href={customerAppUrl} aria-label="FixIt home">
                    <img src="/brand/logo.png" alt="" />
                    <span><strong>FixIt</strong><small>Provider workspace</small></span>
                </a>
                <p className="provider-auth-eyebrow">SERVICE PROVIDER</p>
                <h1 id="provider-auth-title">Welcome back</h1>
                <p className="provider-auth-description">Sign in to manage your services, jobs and earnings.</p>
                {error && <p className="provider-auth-error" role="alert">{error}</p>}
                <form onSubmit={submit} noValidate>
                    <label htmlFor="provider-email">Email address</label>
                    <input id="provider-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <label htmlFor="provider-password">Password</label>
                    <input id="provider-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <button className="provider-auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : 'Sign in to provider workspace'}</button>
                </form>
                <p className="provider-auth-customer-link">Looking for home services? <a href={customerAppUrl}>Log in as a customer</a></p>
            </section>
        </main>
    );
}

function Brand() {
    return (
        <a className="brand" href="#dashboard" aria-label="FixIt provider home">
            <img className="brand-logo" src="/brand/logo.png" alt="" />
            <span>
                <span className="brand-name">FixIt</span>
                <span className="brand-caption">Provider workspace</span>
                <span className="brand-tagline">Trusted help for every home.</span>
            </span>
        </a>
    );
}

function Sidebar({ activePage, onNavigate, isOpen, sidebarRef, onClose }) {
    return (
        <aside ref={sidebarRef} className={`provider-sidebar${isOpen ? ' is-open' : ''}`} id="provider-navigation" aria-label="Provider navigation" role={isOpen ? "dialog" : undefined} aria-modal={isOpen ? true : undefined}>
            <Brand />
            <button className="sidebar-close-button" type="button" onClick={onClose}>Close navigation</button>
            <p className="nav-label">Workspace</p>
            <nav className="provider-nav" aria-label="Main navigation">
                {navigation.map((item) => (
                    <button className="nav-link" type="button" key={item.label} aria-current={activePage === item.label ? 'page' : undefined} onClick={() => onNavigate(item.label)}>
                        <span className="nav-icon" aria-hidden="true"><i className={item.icon} aria-hidden="true" /></span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-bottom">
                <button className="nav-link" type="button" aria-current={activePage === 'Settings' ? 'page' : undefined} onClick={() => onNavigate('Settings')}>
                    <span className="nav-icon" aria-hidden="true"><i className="fa-solid fa-gear" /></span>
                    <span>Settings</span>
                </button>
                <p className="text-muted" style={{ margin: '16px 10px 0', fontSize: '0.75rem' }}>Built for local service professionals.</p>
            </div>
        </aside>
    );
}

function PlaceholderPage({ page }) {
    if (page === 'Not found') {
        return <div className="page-placeholder"><p className="eyebrow">Provider workspace</p><h1>Page not found</h1><p className="text-muted">That page does not exist or is not available yet.</p><section className="card"><h2>Return to your dashboard</h2><p className="text-muted">Use the workspace navigation or return to the dashboard to continue.</p></section></div>;
    }
    return <div className="page-placeholder"><p className="eyebrow">Provider workspace</p><h1>{page}</h1><p className="text-muted">This section will be built in its own feature phase.</p><section className="card"><span className="status-badge status-neutral">Coming in a later phase</span><h2 style={{ marginTop: '18px' }}>Your {page.toLowerCase()} workspace</h2><p className="text-muted" style={{ marginBottom: 0 }}>The navigation and responsive application shell are ready. This screen does not connect to a backend or save account data yet.</p></section></div>;
}

function ProviderWorkspace({ onLogout }) {
    const [activePage, setActivePage] = useState(() => resolvePage(window.location.hash));
    const [menuOpen, setMenuOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const focusable = sidebarRef.current?.querySelectorAll('a[href], button:not([disabled])');
        focusable?.[0]?.focus();
        function trapFocus(event) {
            if (event.key === 'Escape') { event.preventDefault(); setMenuOpen(false); menuButtonRef.current?.focus(); return; }
            if (event.key !== 'Tab' || !focusable?.length) return;
            const first = focusable[0]; const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        document.addEventListener('keydown', trapFocus);
        return () => {
            document.removeEventListener('keydown', trapFocus);
            if (sidebarRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus();
        };
    }, [menuOpen]);

    useEffect(() => {
        function handleHashChange() { setActivePage(resolvePage(window.location.hash)); setMenuOpen(false); }
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    function navigateTo(page) { setActivePage(page); window.location.hash = page.toLowerCase().replace(/\s+/g, '-'); setMenuOpen(false); }

    return (
        <div className="provider-app">
            <Sidebar activePage={activePage} onNavigate={navigateTo} isOpen={menuOpen} sidebarRef={sidebarRef} onClose={() => setMenuOpen(false)} />
            <button className={`mobile-nav-backdrop${menuOpen ? ' is-visible' : ''}`} type="button" aria-label="Close navigation menu" tabIndex={menuOpen ? 0 : -1} onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }} />
            <main className="provider-main">
                <header className="provider-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button ref={menuButtonRef} className="icon-button mobile-menu-button" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="provider-navigation" onClick={() => setMenuOpen((open) => !open)}>
                            <span aria-hidden="true">{menuOpen ? <i className="fa-solid fa-xmark" aria-hidden="true" /> : <i className="fa-solid fa-bars" aria-hidden="true" />}</span>
                        </button>
                        <p className="topbar-title">{activePage === 'Dashboard' ? 'Provider dashboard' : activePage}</p>
                    </div>
                    <div className="topbar-actions">
                        <button className="icon-button" type="button" aria-label="Notifications"><i className="fa-regular fa-bell" aria-hidden="true" /></button>
                        <span className="avatar" aria-label="Provider account">PR</span>
                        <button className="icon-button" type="button" aria-label="Log out" onClick={onLogout}><i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" /></button>
                    </div>
                </header>
                <div className="provider-content">
                    <FixitAsyncBoundary key={activePage}>
                        <div key={activePage} className="fixit-page-transition">
                            {activePage === 'Dashboard' ? <DashboardPage onNavigate={navigateTo} /> : activePage === 'My Profile' ? <ProfilePage /> : ['My Services', 'Availability'].includes(activePage) ? <ServicesAvailabilityPage section={activePage} /> : activePage === 'Available Jobs' ? <AvailableJobsPage /> : activePage === 'Job Details' ? <AvailableJobsPage initialSelectedJobId="job-201" /> : activePage === 'My Jobs' ? <MyJobsPage /> : activePage === 'Earnings' ? <EarningsPage /> : activePage === 'Reviews' ? <ReviewsPage /> : activePage === 'Settings' ? <SettingsPage /> : <PlaceholderPage page={activePage} />}
                        </div>
                    </FixitAsyncBoundary>
                </div>
            </main>
        </div>
    );
}

function App() {
    const [status, setStatus] = useState('checking');
    const [user, setUser] = useState(null);

    useEffect(() => {
        let active = true;
        if (isDemoAuthEnabled()) {
            const demoUser = readDemoSession('provider');
            if (demoUser) {
                setUser(demoUser);
                setStatus('authenticated');
            } else {
                setStatus('unauthenticated');
            }
        } else {
            authApi.getCurrentUser()
                .then((response) => {
                    if (!active) return;
                    const currentUser = getUser(response);
                    if (!currentUser || typeof currentUser !== 'object') throw new Error('Session response did not contain a provider account.');
                    const role = String(currentUser.role ?? currentUser.accountType ?? '').toLowerCase();
                    if (role && !['provider', 'service_provider'].includes(role)) throw new Error('This account does not have provider access.');
                    setUser(currentUser);
                    setStatus('authenticated');
                })
                .catch(() => { if (active) setStatus('unauthenticated'); });
        }
        return () => { active = false; };
    }, []);

    async function handleAuthenticated(nextUser) {
        setUser(nextUser);
        setStatus('authenticated');
        window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + '#dashboard');
    }

    function handleLogout() {
        if (user?.isDemo) clearDemoSession('provider');
        setUser(null);
        setStatus('unauthenticated');
        window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }

    if (status === 'checking') return <main className="provider-auth-loading" role="status">Checking your session…</main>;
    if (status !== 'authenticated' || !user) return <ProviderAuth onAuthenticated={handleAuthenticated} />;
    return <ProviderWorkspace onLogout={handleLogout} />;
}

export default App;
