import { useEffect, useState } from 'react';
import './App.css';

const navigation = [
    { label: 'Dashboard', icon: '▦' },
    { label: 'My Profile', icon: '○' },
    { label: 'My Services', icon: '◇' },
    { label: 'Availability', icon: '◷' },
    { label: 'Available Jobs', icon: '⌕' },
    { label: 'My Jobs', icon: '▤' },
    { label: 'Messages', icon: '✉' },
    { label: 'Earnings', icon: '₦' },
    { label: 'Reviews', icon: '☆' },
];

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
        <aside className={`provider-sidebar${isOpen ? ' is-open' : ''}`} aria-label="Provider navigation">
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

function Dashboard() {
    return (
        <>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Your workspace</p>
                    <h1>Good morning, provider.</h1>
                    <p>Here is a quick look at your work and what needs your attention.</p>
                </div>
                <div className="heading-actions">
                    <button className="btn btn-secondary" type="button">Edit profile</button>
                    <button className="btn btn-primary" type="button">Find jobs <span aria-hidden="true">↗</span></button>
                </div>
            </div>

            <section className="stats-grid" aria-label="Provider overview">
                <article className="card stat-card">
                    <p className="stat-label">Available jobs</p>
                    <p className="stat-value">12</p>
                    <p className="stat-footnote">Matching your services</p>
                </article>
                <article className="card stat-card">
                    <p className="stat-label">Active jobs</p>
                    <p className="stat-value">3</p>
                    <p className="stat-footnote"><span className="status-badge status-warning">In progress</span></p>
                </article>
                <article className="card stat-card">
                    <p className="stat-label">This month's earnings</p>
                    <p className="stat-value">₦185,000</p>
                    <p className="stat-footnote">Illustrative dashboard data</p>
                </article>
                <article className="card stat-card">
                    <p className="stat-label">Average rating</p>
                    <p className="stat-value">4.8 <span aria-hidden="true" style={{ fontSize: '1rem' }}>★</span></p>
                    <p className="stat-footnote">From customer reviews</p>
                </article>
            </section>

            <div className="dashboard-grid">
                <section className="card" aria-labelledby="jobs-heading">
                    <div className="card-header">
                        <div>
                            <h2 id="jobs-heading">Recent job activity</h2>
                            <p>Keep track of work that needs your attention.</p>
                        </div>
                        <button className="btn btn-quiet" type="button">View all</button>
                    </div>
                    <div className="job-list">
                        <article className="job-row">
                            <div>
                                <p className="job-title">Kitchen tap repair</p>
                                <p className="job-meta">Peter Odili Road, Port Harcourt</p>
                                <p style={{ margin: '8px 0 0' }}><span className="status-badge status-warning">Awaiting response</span></p>
                            </div>
                            <span className="job-price">₦18,000</span>
                        </article>
                        <article className="job-row">
                            <div>
                                <p className="job-title">Bedroom light installation</p>
                                <p className="job-meta">Rumuola, Port Harcourt</p>
                                <p style={{ margin: '8px 0 0' }}><span className="status-badge status-success">Accepted</span></p>
                            </div>
                            <span className="job-price">₦25,000</span>
                        </article>
                        <article className="job-row">
                            <div>
                                <p className="job-title">Air conditioner servicing</p>
                                <p className="job-meta">GRA Phase 2, Port Harcourt</p>
                                <p style={{ margin: '8px 0 0' }}><span className="status-badge status-neutral">Scheduled</span></p>
                            </div>
                            <span className="job-price">₦35,000</span>
                        </article>
                    </div>
                </section>

                <section className="card" aria-labelledby="actions-heading">
                    <div className="card-header">
                        <div>
                            <h2 id="actions-heading">Quick actions</h2>
                            <p>Keep your provider profile ready.</p>
                        </div>
                    </div>
                    <div className="quick-actions">
                        <button className="quick-action" type="button">
                            <span className="quick-action-icon" aria-hidden="true">＋</span>
                            <span className="quick-action-copy"><strong>Add a service</strong><span>Show customers what you do</span></span>
                        </button>
                        <button className="quick-action" type="button">
                            <span className="quick-action-icon" aria-hidden="true">◷</span>
                            <span className="quick-action-copy"><strong>Set availability</strong><span>Keep your working hours current</span></span>
                        </button>
                        <button className="quick-action" type="button">
                            <span className="quick-action-icon" aria-hidden="true">○</span>
                            <span className="quick-action-copy"><strong>Complete your profile</strong><span>Help customers get to know you</span></span>
                        </button>
                    </div>
                </section>
            </div>
            <p className="text-muted" style={{ margin: '18px 2px 0', fontSize: '0.75rem' }}>
                Preview only: figures and job examples are mock data, not live account information.
            </p>
        </>
    );
}

function PlaceholderPage({ page }) {
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
    const [activePage, setActivePage] = useState('Dashboard');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return undefined;

        function handleKeyDown(event) {
            if (event.key === 'Escape') setMenuOpen(false);
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

    function navigateTo(page) {
        setActivePage(page);
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
                    {activePage === 'Dashboard' ? <Dashboard /> : <PlaceholderPage page={activePage} />}
                </div>
            </main>
        </div>
    );
}

export default App;
