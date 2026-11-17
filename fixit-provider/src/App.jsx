import { lazy, Suspense, useEffect, useState } from 'react';
import './App.css';

const DashboardPage = lazy(() => import('./DashboardPage.jsx'));
const AvailableJobsPage = lazy(() => import('./AvailableJobsPage.jsx'));
const ProfilePage = lazy(() => import('./ProfilePage.jsx'));
const ServicesAvailabilityPage = lazy(() => import('./ServicesAvailabilityPage.jsx'));
const MyJobsPage = lazy(() => import('./MyJobsPage.jsx'));
const EarningsPage = lazy(() => import('./EarningsPage.jsx'));
const ReviewsPage = lazy(() => import('./ReviewsPage.jsx'));
const SettingsPage = lazy(() => import('./SettingsPage.jsx'));

const navigation = [
    { label: 'Dashboard', icon: '▦' },
    { label: 'My Profile', icon: '○' },
    { label: 'My Services', icon: '◇' },
    { label: 'Availability', icon: '◷' },
    { label: 'Available Jobs', icon: '⌕' },
    { label: 'Job Details', icon: '↗' },
    { label: 'My Jobs', icon: '▤' },
    { label: 'Earnings', icon: '₦' },
    { label: 'Reviews', icon: '☆' },
];

function resolvePage(hash) {
    const slug = hash.replace(/^#/, '').trim().toLowerCase();
    if (!slug || slug === 'dashboard') return 'Dashboard';

    const pages = [...navigation, { label: 'Settings', icon: '⚙' }];
    return pages.find((page) => page.label.toLowerCase().replace(/\s+/g, '-') === slug)?.label ?? 'Not found';
}

function Brand() {
    return (
        <a className="brand" href="#dashboard" aria-label="FixIt provider home">
            <span className="brand-mark" aria-hidden="true">F</span>
            <span>
                <span className="brand-name">FixIt</span>
                <span className="brand-caption">Provider workspace</span>
            </span>
        </a>
    );
}

function Sidebar({ activePage, onNavigate, isOpen }) {
    return (
        <aside className={`provider-sidebar${isOpen ? ' is-open' : ''}`} id="provider-navigation" aria-label="Provider navigation">
            <Brand />
            <p className="nav-label">Workspace</p>
            <nav className="provider-nav" aria-label="Main navigation">
                {navigation.map((item) => (
                    <button
                        className="nav-link"
                        type="button"
                        key={item.label}
                        aria-current={activePage === item.label ? 'page' : undefined}
                        onClick={() => onNavigate(item.label)}
                    >
                        <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-bottom">
                <button
                    className="nav-link"
                    type="button"
                    aria-current={activePage === 'Settings' ? 'page' : undefined}
                    onClick={() => onNavigate('Settings')}
                >
                    <span className="nav-icon" aria-hidden="true">⚙</span>
                    <span>Settings</span>
                </button>
                <p className="text-muted" style={{ margin: '16px 10px 0', fontSize: '0.75rem' }}>
                    Built for local service professionals.
                </p>
            </div>
        </aside>
    );
}

function PlaceholderPage({ page }) {
    if (page === 'Not found') {
        return (
            <div className="page-placeholder">
                <p className="eyebrow">Provider workspace</p>
                <h1>Page not found</h1>
                <p className="text-muted">That page does not exist or is not available yet.</p>
                <section className="card">
                    <h2>Return to your dashboard</h2>
                    <p className="text-muted">Use the workspace navigation or return to the dashboard to continue.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="page-placeholder">
            <p className="eyebrow">Provider workspace</p>
            <h1>{page}</h1>
            <p className="text-muted">This section will be built in its own feature phase.</p>
            <section className="card">
                <span className="status-badge status-neutral">Coming in a later phase</span>
                <h2 style={{ marginTop: '18px' }}>Your {page.toLowerCase()} workspace</h2>
                <p className="text-muted" style={{ marginBottom: 0 }}>
                    The navigation and responsive application shell are ready. This screen does not connect to a backend or save account data yet.
                </p>
            </section>
        </div>
    );
}

function App() {
    const [activePage, setActivePage] = useState(() => resolvePage(window.location.hash));
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return undefined;

        function handleKeyDown(event) {
            if (event.key === 'Escape') setMenuOpen(false);
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

    useEffect(() => {
        function handleHashChange() {
            setActivePage(resolvePage(window.location.hash));
            setMenuOpen(false);
        }

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    function navigateTo(page) {
        setActivePage(page);
        window.location.hash = page.toLowerCase().replace(/\s+/g, '-');
        setMenuOpen(false);
    }

    return (
        <div className="provider-app">
            <Sidebar activePage={activePage} onNavigate={navigateTo} isOpen={menuOpen} />
            <button
                className={`mobile-nav-backdrop${menuOpen ? ' is-visible' : ''}`}
                type="button"
                aria-label="Close navigation menu"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
            />
            <main className="provider-main">
                <header className="provider-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="icon-button mobile-menu-button"
                            type="button"
                            aria-label="Open navigation menu"
                            aria-expanded={menuOpen}
                            aria-controls="provider-navigation"
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
                        </button>
                        <p className="topbar-title">{activePage === 'Dashboard' ? 'Provider dashboard' : activePage}</p>
                    </div>
                    <div className="topbar-actions">
                        <button className="icon-button" type="button" aria-label="Notifications">♧</button>
                        <span className="avatar" aria-label="Provider account">NP</span>
                    </div>
                </header>
                <div className="provider-content">
                    <Suspense fallback={<div className="fixit-page-loading" role="status" aria-live="polite"><span className="fixit-loading-spinner" aria-hidden="true" />Loading page…</div>}>
                        <div key={activePage} className="fixit-page-transition">
                            {activePage === 'Dashboard' ? <DashboardPage onNavigate={navigateTo} /> : activePage === 'My Profile' ? <ProfilePage /> : ['My Services', 'Availability'].includes(activePage) ? <ServicesAvailabilityPage section={activePage} /> : activePage === 'Available Jobs' ? <AvailableJobsPage /> : activePage === 'Job Details' ? <AvailableJobsPage initialSelectedJobId="job-201" /> : activePage === 'My Jobs' ? <MyJobsPage /> : activePage === 'Earnings' ? <EarningsPage /> : activePage === 'Reviews' ? <ReviewsPage /> : activePage === 'Settings' ? <SettingsPage /> : <PlaceholderPage page={activePage} />}
                        </div>
                    </Suspense>
                </div>
            </main>
        </div>
    );
}

export default App;
