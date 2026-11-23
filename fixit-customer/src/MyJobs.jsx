import './styles/pages/my-jobs.css';
import { useMemo, useState } from 'react';
import JobCard from './myjobs/JobCard';

const STATUS_TABS = [
    { value: 'ALL', label: 'All Jobs' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'AWAITING BIDS', label: 'Awaiting Bids' },
    { value: 'IN PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

const EMPTY_VIEW_STATE = {
    search: '',
    statusFilter: 'ALL',
    categoryFilter: 'ALL',
    sortBy: 'recent',
};

function MyJobs({
    jobs = [],
    demoMode = false,
    viewState,
    onViewStateChange,
    onPostJob,
    onViewDetails,
    loading = false,
    error = '',
    onRetry,
}) {
    const [localViewState, setLocalViewState] = useState(EMPTY_VIEW_STATE);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const activeViewState = viewState ?? localViewState;
    const {
        search = '',
        statusFilter = 'ALL',
        categoryFilter = 'ALL',
        sortBy = 'recent',
    } = activeViewState;

    const updateViewState = (field, value) => {
        const update = (current) => ({ ...current, [field]: value });
        if (onViewStateChange) onViewStateChange(update);
        else setLocalViewState(update);
    };

    const categories = useMemo(
        () => [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(),
        [jobs],
    );

    const countFor = (filter) => jobs.filter((job) => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status);
        return job.status === filter;
    }).length;

    const visibleJobs = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = jobs.filter((job) => {
            const searchable = [
                job.id, job.title, job.description, job.category,
                job.location, job.providerName,
            ].join(' ').toLowerCase();
            const matchesSearch = !query || searchable.includes(query);
            const matchesStatus = statusFilter === 'ALL'
                || (statusFilter === 'ACTIVE' && ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status))
                || job.status === statusFilter;
            const matchesCategory = categoryFilter === 'ALL' || job.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === 'price') return (b.priceValue ?? -1) - (a.priceValue ?? -1);
            const aDate = new Date(a.raw?.createdAt || a.raw?.created_at || 0).getTime();
            const bDate = new Date(b.raw?.createdAt || b.raw?.created_at || 0).getTime();
            if (aDate && bDate && aDate !== bDate) {
                return sortBy === 'oldest' ? aDate - bDate : bDate - aDate;
            }
            return sortBy === 'oldest'
                ? a.id.localeCompare(b.id)
                : b.id.localeCompare(a.id);
        });
    }, [jobs, search, statusFilter, categoryFilter, sortBy]);

    const activeCount = countFor('ACTIVE');
    const awaitingCount = countFor('AWAITING BIDS');
    const inProgressCount = countFor('IN PROGRESS');
    const completedCount = countFor('COMPLETED');
    const totalValue = jobs.reduce((sum, job) => (
        job.status === 'COMPLETED' ? sum + (Number(job.priceValue) || 0) : sum
    ), 0);

    const clearFilters = () => {
        if (onViewStateChange) onViewStateChange(EMPTY_VIEW_STATE);
        else setLocalViewState(EMPTY_VIEW_STATE);
    };

    return (
        <section className="my-jobs page-surface my-jobs-workspace">
            <div className="my-jobs-content">
                <nav className="my-jobs-breadcrumb" aria-label="Breadcrumb">
                    <span>FixIt Workspace</span>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                    <strong>My Jobs</strong>
                </nav>

                <header className="my-jobs-titlebar">
                    <div className="my-jobs-heading-copy">
                        <p className="my-jobs-eyebrow">YOUR SERVICE REQUESTS</p>
                        <div className="my-jobs-heading-line">
                            <h1>My Jobs</h1>
                            <span className="my-jobs-total-count">
                                {loading ? 'Loading…' : `${jobs.length} total ${jobs.length === 1 ? 'job' : 'jobs'}`}
                            </span>
                        </div>
                        <p className="my-jobs-subtitle">
                            Track your service requests, compare provider bids and follow each job through completion.
                        </p>
                        {demoMode && (
                            <span className="my-jobs-demo-note">
                                <i className="fa-solid fa-flask" aria-hidden="true" />
                                Sample data for local demo
                            </span>
                        )}
                    </div>
                    <button type="button" className="my-jobs-post-button" onClick={onPostJob}>
                        <i className="fa-solid fa-plus" aria-hidden="true" />
                        <span>Post a New Job</span>
                    </button>
                </header>

                {error ? (
                    <section className="my-jobs-empty my-jobs-state" role="alert">
                        <span><i className="fa-solid fa-triangle-exclamation" aria-hidden="true" /></span>
                        <h2>We couldn’t load your jobs</h2>
                        <p>{error}</p>
                        <button type="button" className="my-jobs-primary-action" onClick={onRetry}>Try again</button>
                    </section>
                ) : (
                    <>
                        <section className="my-jobs-metrics" aria-label="Job summary" aria-busy={loading}>
                            <article className="my-jobs-metric">
                                <div><span>Total jobs</span><strong>{loading ? '—' : jobs.length}</strong><small>All service requests</small></div>
                                <span className="my-jobs-metric-icon"><i className="fa-solid fa-briefcase" aria-hidden="true" /></span>
                            </article>
                            <article className="my-jobs-metric">
                                <div><span>Active engagements</span><strong>{loading ? '—' : activeCount}</strong><small>{loading ? 'Loading' : `${inProgressCount} currently in progress`}</small></div>
                                <span className="my-jobs-metric-icon is-green"><i className="fa-solid fa-screwdriver-wrench" aria-hidden="true" /></span>
                            </article>
                            <article className="my-jobs-metric">
                                <div><span>Awaiting decision</span><strong>{loading ? '—' : awaitingCount}</strong><small>Requests awaiting provider selection</small></div>
                                <span className="my-jobs-metric-icon is-amber"><i className="fa-solid fa-gavel" aria-hidden="true" /></span>
                            </article>
                            <article className="my-jobs-metric">
                                <div><span>Completed jobs</span><strong>{loading ? '—' : completedCount}</strong><small>{loading ? 'Loading' : `₦${totalValue.toLocaleString('en-NG')} recorded`}</small></div>
                                <span className="my-jobs-metric-icon is-blue"><i className="fa-solid fa-circle-check" aria-hidden="true" /></span>
                            </article>
                        </section>

                        <section className="my-jobs-controls" aria-label="Search and filter jobs" aria-busy={loading}>
                            <div className="my-jobs-filter-row">
                                <label className="my-jobs-search">
                                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) => updateViewState('search', event.target.value)}
                                        placeholder="Search tickets, services, providers or locations…"
                                        aria-label="Search jobs"
                                        disabled={loading}
                                    />
                                </label>
                                <button
                                    type="button"
                                    className="my-jobs-filter-toggle"
                                    onClick={() => setShowMobileFilters((visible) => !visible)}
                                    aria-expanded={showMobileFilters}
                                    aria-controls="my-jobs-selects"
                                >
                                    <i className="fa-solid fa-sliders" aria-hidden="true" />
                                    <span>Filters</span>
                                </button>
                                <div id="my-jobs-selects" className={`my-jobs-selects${showMobileFilters ? ' is-open' : ''}`}>
                                    <label>
                                        <span className="sr-only">Filter by category</span>
                                        <select value={categoryFilter} onChange={(event) => updateViewState('categoryFilter', event.target.value)} disabled={loading}>
                                            <option value="ALL">All Categories</option>
                                            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                        </select>
                                    </label>
                                    <label>
                                        <span className="sr-only">Sort jobs</span>
                                        <select value={sortBy} onChange={(event) => updateViewState('sortBy', event.target.value)} disabled={loading}>
                                            <option value="recent">Recent First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="price">Highest Price / Budget</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div className="my-jobs-tabs" role="group" aria-label="Filter by job status">
                                {STATUS_TABS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={statusFilter === value ? 'active' : ''}
                                        onClick={() => updateViewState('statusFilter', value)}
                                        aria-pressed={statusFilter === value}
                                        disabled={loading}
                                    >
                                        <span>{label}</span><span className="my-jobs-tab-count">{loading ? '—' : countFor(value)}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="my-jobs-list-heading">
                            <div><h2>Your requests</h2><span>{loading ? 'Loading' : `${visibleJobs.length} matching ${visibleJobs.length === 1 ? 'job' : 'jobs'}`}</span></div>
                            <span>Sorted by {sortBy === 'recent' ? 'most recent' : sortBy === 'oldest' ? 'oldest first' : 'highest price'}</span>
                        </div>

                        <div className="my-jobs-list" aria-live="polite" aria-busy={loading}>
                            {loading ? (
                                <div className="my-jobs-empty my-jobs-state">
                                    <span><i className="fa-solid fa-spinner fa-spin" aria-hidden="true" /></span>
                                    <h2>Loading your jobs</h2>
                                    <p>Your latest service requests are being retrieved.</p>
                                </div>
                            ) : visibleJobs.map((job) => (
                                <JobCard key={job.id} job={job} onViewDetails={() => onViewDetails(job)} />
                            ))}
                            {!loading && visibleJobs.length === 0 && (
                                <div className="my-jobs-empty">
                                    <span><i className="fa-solid fa-clipboard-list" aria-hidden="true" /></span>
                                    <h2>{jobs.length === 0 ? 'No jobs yet' : 'No jobs match these filters'}</h2>
                                    <p>{jobs.length === 0
                                        ? 'You have not posted any service requests yet.'
                                        : 'Try changing your search, category or status filter.'}</p>
                                    {jobs.length === 0
                                        ? <button type="button" className="my-jobs-primary-action" onClick={onPostJob}>Post your first job</button>
                                        : <button type="button" className="my-jobs-secondary-action" onClick={clearFilters}>Clear filters</button>}
                                </div>
                            )}
                        </div>

                        <aside className="my-jobs-trust-panel">
                            <span className="my-jobs-trust-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true" /></span>
                            <div>
                                <strong>Keep every job on FixIt</strong>
                                <p>Review job details and payment status in your workspace. Payment availability and protection depend on the services enabled for your account.</p>
                            </div>
                        </aside>
                    </>
                )}
            </div>
        </section>
    );
}

export default MyJobs;
