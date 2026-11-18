import { useEffect, useRef, useState } from 'react;
import './App.css';
import { FixitAsyncBoundary } from './FixitAsyncBoundary.jsx';

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
    { label: 'Dashboard', icon: '▦', group: 'Overview' },
    { label: 'Customers', icon: '♙', group: 'People' },
    { label: 'Providers', icon: '♧', group: 'People' },
    { label: 'Verification', icon: '✓', group: 'People' },
    { label: 'Jobs', icon: '▤', group: 'Operations' },
    { label: 'Disputes & support', icon: '◌', group: 'Operations' },
    { label: 'Categories', icon: '◇', group: 'Operations' },
    { label: 'Analytics', icon: '▥', group: 'Insights' },
    { label: 'Settings', icon: '⚙', group: 'System' },
];

function Brand() {
    return (
        <a className="admin-brand" href="#dashboard" aria-label="FixIt admin dashboard">
            <span className="brand-mark" aria-hidden="true">F</span>
            <span className="brand-copy">
                <strong>FixIt</strong>
                <span>ADMINISTRATION</span>
            </span>
        </a>
    );
}

function Sidebar({ activePage, onNavigate, isOpen, sidebarRef, onClose }) {
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
                                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
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

function App() {
    const [activePage, setActivePage] = useState(() => resolvePage(window.location.hash));
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

    function navigateTo(page) {
        setActivePage(page);
        window.location.hash = page.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setMenuOpen(false);
    }

    return (
        <div className="admin-app">
            <Sidebar activePage={activePage} onNavigate={navigateTo} isOpen={menuOpen} sidebarRef={sidebarRef} onClose={() => setMenuOpen(false)} />
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
                            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
                        </button>
                        <span className="breadcrumb">FixIt <span aria-hidden="true">/</span> {activePage}</span>
                    </div>
                    <div className="topbar-right">
                        <span className="environment-tag">DEMO</span>
                        <button className="icon-button notification-button" type="button" aria-label="Notifications are not connected" disabled>♧</button>
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
