const demoDashboard = {
    opportunities: 12,
    bidsAwaitingResponse: 2,
    acceptedJobs: 4,
    workInProgress: 2,
    completedJobs: 8,
    earnings: { estimated: 95000, agreed: 180000, paid: 125000 },
    recentJobs: [
        { id: 'job-1', title: 'Kitchen tap repair', location: 'Peter Odili Road, Port Harcourt', status: 'Bid awaiting response', amount: 18000, amountType: 'Estimated quote' },
        { id: 'job-2', title: 'Bedroom light installation', location: 'Rumuola, Port Harcourt', status: 'Accepted', amount: 25000, amountType: 'Agreed amount' },
        { id: 'job-3', title: 'Air conditioner servicing', location: 'GRA Phase 2, Port Harcourt', status: 'In progress', amount: 35000, amountType: 'Agreed amount' },
    ],
};

const formatNaira = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
}).format(amount);

const dashboardMetrics = [
    { key: 'opportunities', label: 'Available opportunities', description: 'Jobs matching your services' },
    { key: 'bidsAwaitingResponse', label: 'Bids awaiting response', description: 'Waiting for customer decisions' },
    { key: 'acceptedJobs', label: 'Accepted jobs', description: 'Jobs agreed with customers' },
    { key: 'workInProgress', label: 'Work in progress', description: 'Jobs currently underway' },
    { key: 'completedJobs', label: 'Completed jobs', description: 'Jobs marked complete' },
];

export default function DashboardPage({ dataState = 'populated', onNavigate = () => {}, onRetry = () => {} }) {
    if (dataState === 'loading') {
        return (
            <section className="dashboard-state card" aria-busy="true" aria-live="polite">
                <p className="eyebrow">Provider overview</p>
                <h1>Loading your dashboard</h1>
                <p className="text-muted">Fetching your jobs and earnings…</p>
                <div className="loading-bars" aria-hidden="true"><span /><span /><span /></div>
            </section>
        );
    }

    if (dataState === 'error') {
        return (
            <section className="dashboard-state card" role="alert">
                <p className="eyebrow">Provider overview</p>
                <h1>We couldn’t load your dashboard</h1>
                <p className="text-muted">Your figures have not been changed. Check your connection and try again.</p>
                <button className="btn btn-primary" type="button" onClick={onRetry}>Try again</button>
            </section>
        );
    }

    const isEmpty = dataState === 'empty';
    const data = isEmpty ? {
        opportunities: 0, bidsAwaitingResponse: 0, acceptedJobs: 0,
        workInProgress: 0, completedJobs: 0,
        earnings: { estimated: 0, agreed: 0, paid: 0 }, recentJobs: [],
    } : demoDashboard;

    return (
        <>
            <div className="demo-notice" role="note">
                <strong>Demo data</strong>
                <span>These sample figures are illustrative only and are not live provider earnings or platform records.</span>
            </div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Your workspace</p>
                    <h1>Provider dashboard</h1>
                    <p>See opportunities, track active work, and understand where each payment stands.</p>
                </div>
                <div className="heading-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => onNavigate('My Profile')}>Edit profile</button>
                    <button className="btn btn-primary" type="button" onClick={() => onNavigate('Available Jobs')}>Find jobs <span aria-hidden="true">↗</span></button>
                </div>
            </div>

            <section className="stats-grid dashboard-metrics" aria-label="Job overview">
                {dashboardMetrics.map((metric) => (
                    <article className="card stat-card" key={metric.key}>
                        <p className="stat-label">{metric.label}</p>
                        <p className="stat-value">{data[metric.key]}</p>
                        <p className="stat-footnote">{metric.description}</p>
                    </article>
                ))}
            </section>

            <section className="card earnings-panel" aria-labelledby="earnings-heading">
                <div className="card-header">
                    <div>
                        <h2 id="earnings-heading">Earnings overview</h2>
                        <p>Different amounts mean different things. They are not interchangeable.</p>
                    </div>
                    <button className="btn btn-quiet" type="button" onClick={() => onNavigate('Earnings')}>View earnings</button>
                </div>
                <div className="earnings-grid">
                    <article className="earning-item">
                        <span className="earning-label">Estimated</span>
                        <strong>{formatNaira(data.earnings.estimated)}</strong>
                        <p>Quotes or bids submitted. Not yet agreed.</p>
                    </article>
                    <article className="earning-item">
                        <span className="earning-label">Agreed</span>
                        <strong>{formatNaira(data.earnings.agreed)}</strong>
                        <p>Amounts accepted by customers. Not proof of payment.</p>
                    </article>
                    <article className="earning-item">
                        <span className="earning-label">Paid</span>
                        <strong>{formatNaira(data.earnings.paid)}</strong>
                        <p>Payments confirmed as paid by the data source.</p>
                    </article>
                </div>
            </section>

            <div className="dashboard-grid">
                <section className="card" aria-labelledby="jobs-heading">
                    <div className="card-header">
                        <div>
                            <h2 id="jobs-heading">Recent job activity</h2>
                            <p>Review opportunities and work that needs your attention.</p>
                        </div>
                        <button className="btn btn-quiet" type="button" onClick={() => onNavigate('My Jobs')}>View jobs</button>
                    </div>
                    {data.recentJobs.length === 0 ? (
                        <div className="empty-state">
                            <h3>{isEmpty ? 'Nothing here yet' : 'No recent jobs'}</h3>
                            <p>{isEmpty ? 'When opportunities and jobs appear on your account, they will show up here.' : 'Recent job activity will appear here.'}</p>
                            <button className="btn btn-secondary" type="button" onClick={() => onNavigate('Available Jobs')}>Explore opportunities</button>
                        </div>
                    ) : (
                        <div className="job-list">
                            {data.recentJobs.map((job) => (
                                <article className="job-row" key={job.id}>
                                    <div>
                                        <p className="job-title">{job.title}</p>
                                        <p className="job-meta">{job.location}</p>
                                        <p className="job-row-status"><span className="status-badge status-neutral">{job.status}</span></p>
                                    </div>
                                    <div className="job-amount">
                                        <strong>{formatNaira(job.amount)}</strong>
                                        <span>{job.amountType}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="card" aria-labelledby="actions-heading">
                    <div className="card-header">
                        <div>
                            <h2 id="actions-heading">Quick actions</h2>
                            <p>Keep your provider workspace up to date.</p>
                        </div>
                    </div>
                    <div className="quick-actions">
                        <button className="quick-action" type="button" onClick={() => onNavigate('My Services')}>
                            <span className="quick-action-icon" aria-hidden="true">＋</span>
                            <span className="quick-action-copy"><strong>Manage services</strong><span>Update the services you offer</span></span>
                        </button>
                        <button className="quick-action" type="button" onClick={() => onNavigate('Availability')}>
                            <span className="quick-action-icon" aria-hidden="true">◷</span>
                            <span className="quick-action-copy"><strong>Set availability</strong><span>Keep your working hours current</span></span>
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
}
