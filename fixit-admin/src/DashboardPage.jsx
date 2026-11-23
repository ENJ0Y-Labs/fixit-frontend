const demoMetrics = [
    { label: 'Total customers', value: '1,284', change: '+8.2%', note: 'vs. previous month', tone: 'positive', icon: 'fa-solid fa-users' },
    { label: 'Registered providers', value: '342', change: '+5.4%', note: 'vs. previous month', tone: 'positive', icon: 'fa-solid fa-user-tie' },
    { label: 'Jobs on platform', value: '856', change: '+12.6%', note: 'vs. previous month', tone: 'positive', icon: 'fa-solid fa-briefcase' },
    { label: 'Pending verification', value: '4', change: 'Needs review', note: 'Sample queue records', tone: 'attention', icon: 'fa-solid fa-user-shield' },
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

function StatusBadge({ status }) {
    const className = status === 'Completed' ? 'status-success'
        : status === 'Disputed' ? 'status-danger'
            : status === 'In progress' ? 'status-info' : 'status-warning';

    return <span className={`status-badge ${className}`}>{status}</span>;
}

export default function DashboardPage({ onNavigate }) {
    return (
        <>
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true"><i className="fa-solid fa-circle-info" /></span>
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
                            <span className="metric-icon" aria-hidden="true"><i className={metric.icon} aria-hidden="true" /></span>
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
                        <div><h2>Recent job activity</h2><p>Sample marketplace records for interface preview.</p></div>
                        <button className="text-button" type="button" onClick={() => onNavigate('Jobs')}>View jobs <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></button>
                    </div>
                    <div className="table-wrap">
                        <table className="activity-table">
                            <thead><tr><th scope="col">Job</th><th scope="col">Customer / Provider</th><th scope="col">Status</th><th scope="col">Amount</th><th scope="col">Created</th></tr></thead>
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
                    <div className="panel-header"><div><h2 id="attention-heading">Needs attention</h2><p>Items an admin may need to review.</p></div></div>
                    <button className="attention-item" type="button" onClick={() => onNavigate('Verification')}>
                        <span className="attention-icon warning" aria-hidden="true"><i className="fa-solid fa-circle-check" /></span>
                        <span className="attention-copy"><strong>Provider verification</strong><small>Applications awaiting review</small></span>
                        <strong className="attention-number">4</strong>
                    </button>
                    <button className="attention-item" type="button" onClick={() => onNavigate('Disputes & support')}>
                        <span className="attention-icon danger" aria-hidden="true"><i className="fa-solid fa-triangle-exclamation" /></span>
                        <span className="attention-copy"><strong>Open disputes</strong><small>Require investigation</small></span>
                        <strong className="attention-number">7</strong>
                    </button>
                    <button className="attention-item" type="button" onClick={() => onNavigate('Jobs')}>
                        <span className="attention-icon neutral" aria-hidden="true"><i className="fa-solid fa-briefcase" /></span>
                        <span className="attention-copy"><strong>Unassigned jobs</strong><small>Awaiting provider response</small></span>
                        <strong className="attention-number">23</strong>
                    </button>
                    <div className="attention-footnote">Sample counts only. No live queues are connected.</div>
                </aside>
            </section>
        </>
    );
}
