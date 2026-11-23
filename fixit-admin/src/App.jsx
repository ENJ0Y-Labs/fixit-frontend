import { useEffect, useRef, useState } from 'react';
import './App.css';
import { FixitAsyncBoundary } from './FixitAsyncBoundary.jsx';
import { createDemoUser, isDemoAuthEnabled, isDemoCredentials, readDemoSession, writeDemoSession, clearDemoSession } from '../../shared/demo-auth.js';
import './DemoAuth.css';

import DashboardPage from './DashboardPage.jsx';
import ProvidersPage from './ProvidersPage.jsx';
import CustomersPage from './CustomersPage.jsx';
import VerificationPage from './VerificationPage.jsx';
import JobsPage from './JobsPage.jsx';
import DisputesSupportPage from './DisputesSupportPage.jsx';
import CategoriesPage from './CategoriesPage.jsx';
import AnalyticsPage from './AnalyticsPage.jsx';
import SettingsPage from './SettingsPage.jsx';

const navigation = [
    { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', group: 'Overview' },
    { label: 'Customers', icon: 'fa-solid fa-users', group: 'People' },
    { label: 'Providers', icon: 'fa-solid fa-user-tie', group: 'People' },
    { label: 'Verification', icon: 'fa-solid fa-user-shield', group: 'People' },
    { label: 'Jobs', icon: 'fa-solid fa-briefcase', group: 'Operations' },
    { label: 'Disputes & support', icon: 'fa-solid fa-life-ring', group: 'Operations' },
    { label: 'Categories', icon: 'fa-solid fa-layer-group', group: 'Operations' },
    { label: 'Analytics', icon: 'fa-solid fa-chart-line', group: 'Insights' },
    { label: 'Settings', icon: 'fa-solid fa-gear', group: 'System' },
];

function Brand() {
    return (
        <a className="admin-brand" href="#dashboard" aria-label="FixIt admin dashboard">
            <img className="brand-logo" src="/brand/logo.png" alt="" />
            <span className="brand-copy">
                <strong>FixIt</strong>
                <span>ADMINISTRATION</span>
                <span className="brand-tagline">Trusted help for every home.</span>
            </span>
        </a>
    );
}

function Sidebar({ activePage, onNavigate, isOpen, sidebarRef, onClose, onLogout, isDemoUser }) {
    const groups = [...new Set(navigation.map((item) => item.group))];

    return (
        <aside ref={sidebarRef} className={`admin-sidebar${isOpen ? ' is-open' : ''}`} id="admin-navigation" aria-label="Admin navigation" role={isOpen ? "dialog" : undefined} aria-modal={isOpen ? true : undefined}>
            <Brand />
            <button className="sidebar-close-button" type="button" onClick={onClose}>Close navigation</button>
            <nav className="admin-nav" aria-label="Main navigation">
                {groups.map((group) => (
                    <div className="nav-group" key={group}>
                        <p className="nav-group-label">{group}</p>
                        {navigation.filter((item) => item.group === group).map((item) => (
                            <button
                                className="admin-nav-link"
                                type="button"
                                key={item.label}
                                aria-current={activePage === item.label ? 'page' : undefined}
                                onClick={() => onNavigate(item.label)}
                            >
                                <span className="nav-icon" aria-hidden="true"><i className={item.icon} aria-hidden="true" /></span>
                                <span>{item.label}</span>
                                {item.label === 'Verification' && <span className="nav-count">4</span>}
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="admin-user">
                    <span className="admin-avatar">AD</span>
                    <span><strong>Admin workspace</strong><small>Demo account</small></span>
                </div>
                <p>FixIt operations console</p>
                {isDemoUser && <button className="admin-demo-logout" type="button" onClick={onLogout}><i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" /> Log out</button>}
            </div>
        </aside>
    );
}

function PlaceholderPage({ page }) {
    const descriptions = {
        Analytics: 'Explore platform activity and operational reporting.',
        Settings: 'Configure administrative preferences and platform settings.',
    };

    return (
        <section className="placeholder-panel panel">
            <p className="eyebrow">Admin workspace</p>
            <h1>{page}</h1>
            <p>{descriptions[page] ?? 'This admin section is not available.'}</p>
            <div className="placeholder-notice">
                <strong>Not implemented yet</strong>
                <span>This is a navigation placeholder. It does not load, change, or save platform records.</span>
            </div>
        </section>
    );
}

function resolvePage(hash) {
    const slug = hash.replace(/^#/, '').trim().toLowerCase();
    if (!slug || slug === 'dashboard') return 'Dashboard';
    return navigation.find((item) => item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)?.label ?? 'Not found';
}

function DemoAdminLogin({ onLogin }) {
    const [email, setEmail] = useState('demo@fixit.local');
    const [password, setPassword] = useState('FixitDemo123!');
    const [error, setError] = useState('');
    function submit(event) {
        event.preventDefault();
        if (!isDemoCredentials(email, password)) {
            setError('The demo email or password is incorrect.');
            return;
        }
        onLogin();
    }
    return (
        <main className="admin-demo-auth-page">
            <section className="admin-demo-auth-card" aria-labelledby="admin-demo-title">
                <a className="admin-demo-brand" href="#dashboard"><img src="/brand/logo.png" alt="" /><span><strong>FixIt</strong><small>Admin workspace</small></span></a>
                <p className="eyebrow">LOCAL DEMO ACCESS</p>
                <h1 id="admin-demo-title">Welcome back</h1>
                <p className="admin-demo-description">Sign in to explore the FixIt administration workspace.</p>
                {error && <p className="admin-demo-error" role="alert">{error}</p>}
                <form onSubmit={submit}>
                    <label htmlFor="admin-demo-email">Email address</label>
                    <input id="admin-demo-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <label htmlFor="admin-demo-password">Password</label>
                    <input id="admin-demo-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <button className="admin-demo-submit" type="submit">Sign in to admin workspace</button>
                </form>
                <p className="admin-demo-hint">Demo account: <strong>demo@fixit.local</strong><br />Password: <strong>FixitDemo123!</strong></p>
                <p className="admin-demo-warning">Local development only. Demo access does not authenticate with the backend.</p>
            </section>
        </main>
    );
}

function App() {
    const demoAuthEnabled = isDemoAuthEnabled();
    const [demoUser, setDemoUser] = useState(() => demoAuthEnabled ? readDemoSession('admin') : null);
    const [demoStatus, setDemoStatus] = useState(() => {
        if (!demoAuthEnabled) return 'ready';
        return readDemoSession('admin') ? 'ready' : 'login';
    });
    const [activePage, setActivePage] = useState(() => resolvePage(window.location.hash));
    function handleDemoLogin() {
        const user = createDemoUser('admin');
        writeDemoSession(user);
        setDemoUser(user);
        setDemoStatus('ready');
    }
    function handleDemoLogout() {
        clearDemoSession('admin');
        setDemoUser(null);
        setDemoStatus('login');
    }
    const [menuOpen, setMenuOpen] = useState(false);
    const sidebarRef = useRef(null);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const focusable = sidebarRef.current?.querySelectorAll('a[href], button:not([disabled])');
        focusable?.[0]?.focus();
        function trapFocus(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                setMenuOpen(false);
                menuButtonRef.current?.focus();
                return;
            }
            if (event.key !== 'Tab' || !focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
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
        function handleHashChange() {
            setActivePage(resolvePage(window.location.hash));
            setMenuOpen(false);
        }
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (demoStatus === 'checking') return <main className="admin-demo-loading" role="status">Preparing admin workspace…</main>;
    if (demoStatus === 'login') return <DemoAdminLogin onLogin={handleDemoLogin} />;

    function navigateTo(page) {
        setActivePage(page);
        window.location.hash = page.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setMenuOpen(false);
    }

    return (
        <div className="admin-app">
            <Sidebar activePage={activePage} onNavigate={navigateTo} isOpen={menuOpen} sidebarRef={sidebarRef} onClose={() => setMenuOpen(false)} onLogout={handleDemoLogout} isDemoUser={Boolean(demoUser)} />
            <button
                className={`mobile-backdrop${menuOpen ? ' is-visible' : ''}`}
                type="button"
                aria-label="Close navigation menu"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}
            />
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button
                            ref={menuButtonRef} className="icon-button mobile-menu-button"
                            type="button"
                            aria-label="Open navigation menu"
                            aria-expanded={menuOpen}
                            aria-controls="admin-navigation"
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <span aria-hidden="true">{menuOpen ? <i className="fa-solid fa-xmark" aria-hidden="true" /> : <i className="fa-solid fa-bars" aria-hidden="true" />}</span>
                        </button>
                        <span className="breadcrumb">FixIt <span aria-hidden="true">/</span> {activePage}</span>
                    </div>
                    <div className="topbar-right">
                        <span className="environment-tag">DEMO</span>
                        <button className="icon-button notification-button" type="button" aria-label="Notifications are not connected" disabled><i className="fa-regular fa-bell" aria-hidden="true" /></button>
                        <span className="topbar-avatar" aria-label="Demo administrator">AD</span>
                    </div>
                </header>
                <div className="admin-content">
                    <FixitAsyncBoundary key={activePage}>
                    
                        <div key={activePage} className="fixit-page-transition">
                            {activePage === 'Dashboard'
                        ? <DashboardPage onNavigate={navigateTo} />
                        : activePage === 'Providers'
                            ? <ProvidersPage />
                            : activePage === 'Customers'
                                ? <CustomersPage />
                                : activePage === 'Verification'
                                    ? <VerificationPage />
                                    : activePage === 'Jobs'
                                        ? <JobsPage />
                                        : activePage === 'Disputes & support'
                                            ? <DisputesSupportPage />
                                            : activePage === 'Categories'
                                                ? <CategoriesPage />
                                                : activePage === 'Analytics'
                                                    ? <AnalyticsPage />
                                                    : activePage === 'Settings'
                                                        ? <SettingsPage />
                                                        : <PlaceholderPage page={activePage} />}
                        </div>
                    
                    </FixitAsyncBoundary>
                </div>
            </main>
        </div>
    );
}

export default App;
