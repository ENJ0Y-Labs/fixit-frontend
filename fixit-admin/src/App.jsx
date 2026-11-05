import { useEffect, useState } from 'react';
import './App.css';
import ProvidersPage from './ProvidersPage.jsx';
import CustomersPage from './CustomersPage.jsx';
import VerificationPage from './VerificationPage.jsx';
import JobsPage from './JobsPage.jsx';
import DisputesSupportPage from './DisputesSupportPage.jsx';

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

const demoMetrics = [
    { label: 'Total customers', value: '1,284', change: '+8.2%', note: 'vs. previous month', tone: 'positive', icon: '♙' },
    { label: 'Registered providers', value: '342', change: '+5.4%', note: 'vs. previous month', tone: 'positive', icon: '♧' },
    { label: 'Jobs on platform', value: '856', change: '+12.6%', note: 'vs. previous month', tone: 'positive', icon: '▤' },
    { label: 'Pending verification', value: '4', change: 'Needs review', note: 'Sample queue records', tone: 'attention', icon: '✓' },
];

const demoActivity = [
    { id: 'FX-2048', title: 'Kitchen plumbing repair', customer: 'Ada N.', provider: 'Provider sample 014', status: 'In progress', amount: 28000, date: 'Today, 09:42' },
    { id: 'FX-2047', title: 'Electrical inspection', customer: 'Chidi O.', provider: 'Provider sample 031', status: 'Awaiting bids', amount: 0, date: 'Today, 08:16' },
    { id: 'FX-2046', title: 'Two-bedroom deep cleaning', customer: 'Mariam A.', provider: 'Provider sample 008', status: 'Completed', amount: 45000, date: 'Yesterday' },
    { id: 'FX-2045', title: 'Water heater installation', customer: 'Tunde K.', provider: 'Not assigned', status: 'Disputed', amount: 65000, date: 'Yesterday' },
];

const formatNaira = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
}).format(amount);

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

function Sidebar({ activePage, onNavigate, isOpen }) {
    const groups = [...new Set(navigation.map((item) => item.group))];

    return (
        <aside className={`admin-sidebar${isOpen ? ' is-open' : ''}`} id="admin-navigation" aria-label="Admin navigation">
            <Brand />
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

function StatusBadge({ status }) {
    const className = status === 'Completed' ? 'status-success'
        : status === 'Disputed' ? 'status-danger'
            : status === 'In progress' ? 'status-info' : 'status-warning';

    return <span className={`status-badge ${className}`}>{status}</span>;
}

function Dashboard({ onNavigate }) {
    return (
        <>
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Demo environment</strong> These are illustrative sample figures and records, not live FixIt platform data.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">Operations overview</p>
                    <h1>Platform overview</h1>
                    <p className="page-description">A snapshot of activity across the FixIt marketplace.</p>
                </div>
                <span className="date-label">Sample reporting period · November 2026</span>
            </section>

            <section className="metrics-grid" aria-label="Platform metrics">
                {demoMetrics.map((metric) => (
                    <article className="metric-card" key={metric.label}>
                        <div className="metric-topline">
                            <span className="metric-icon" aria-hidden="true">{metric.icon}</span>
                            <span className={`metric-change ${metric.tone}`}>{metric.change}</span>
                        </div>
                        <p className="metric-label">{metric.label}</p>
                        <strong className="metric-value">{metric.value}</strong>
                        <p className="metric-note">{metric.note}</p>
                    </article>
                ))}
            </section>

            <section className="overview-grid">
                <article className="panel activity-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Recent job activity</h2>
                            <p>Sample marketplace records for interface preview.</p>
                        </div>
                        <button className="text-button" type="button" onClick={() => onNavigate('Jobs')}>View jobs <span aria-hidden="true">↗</span></button>
                    </div>
                    <div className="table-wrap">
                        <table className="activity-table">
                            <thead>
                                <tr><th scope="col">Job</th><th scope="col">Customer / Provider</th><th scope="col">Status</th><th scope="col">Amount</th><th scope="col">Created</th></tr>
                            </thead>
                            <tbody>
                                {demoActivity.map((job) => (
                                    <tr key={job.id}>
                                        <td><strong>{job.title}</strong><small>{job.id}</small></td>
                                        <td><span>{job.customer}</span><small>{job.provider}</small></td>
                                        <td><StatusBadge status={job.status} /></td>
                                        <td className="amount-cell">{job.amount ? formatNaira(job.amount) : 'Not set'}</td>
                                        <td className="date-cell">{job.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>

                <aside className="panel attention-panel" aria-labelledby="attention-heading">
                    <div className="panel-header">
                        <div>
                            <h2 id="attention-heading">Needs attention</h2>
                            <p>Items an admin may need to review.</p>
                        </div>
                    </div>
                    <button className="attention-item" type="button" onClick={() => onNavigate('Verification')}>
                        <span className="attention-icon warning" aria-hidden="true">✓</span>
                        <span className="attention-copy"><strong>Provider verification</strong><small>Applications awaiting review</small></span>
                        <strong className="attention-number">4</strong>
                    </button>
                    <button className="attention-item" type="button" onClick={() => onNavigate('Disputes & support')}>
                        <span className="attention-icon danger" aria-hidden="true">!</span>
                        <span className="attention-copy"><strong>Open disputes</strong><small>Require investigation</small></span>
                        <strong className="attention-number">7</strong>
                    </button>
                    <button className="attention-item" type="button" onClick={() => onNavigate('Jobs')}>
                        <span className="attention-icon neutral" aria-hidden="true">▤</span>
                        <span className="attention-copy"><strong>Unassigned jobs</strong><small>Awaiting provider response</small></span>
                        <strong className="attention-number">23</strong>
                    </button>
                    <div className="attention-footnote">Sample counts only. No live queues are connected.</div>
                </aside>
            </section>
        </>
    );
}

function PlaceholderPage({ page }) {
    const descriptions = {
        Customers: 'Review customer accounts and account activity.',
        Verification: 'Review submitted provider verification information.',
        Jobs: 'Monitor marketplace jobs and their current statuses.',
        'Disputes & support': 'Review reported issues, disputes, and support requests.',
        Categories: 'Manage the service categories available on FixIt.',
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
        window.location.hash = page.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setMenuOpen(false);
    }

    return (
        <div className="admin-app">
            <Sidebar activePage={activePage} onNavigate={navigateTo} isOpen={menuOpen} />
            <button
                className={`mobile-backdrop${menuOpen ? ' is-visible' : ''}`}
                type="button"
                aria-label="Close navigation menu"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
            />
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button
                            className="icon-button mobile-menu-button"
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
                    {activePage === 'Dashboard'
                        ? <Dashboard onNavigate={navigateTo} />
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
                                            : <PlaceholderPage page={activePage} />}
                </div>
            </main>
        </div>
    );
}

export default App;
