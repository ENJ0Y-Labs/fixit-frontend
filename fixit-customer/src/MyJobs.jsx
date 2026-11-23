import './styles/pages/my-jobs.css';
import './styles/pages/account.css';
import { useMemo, useState } from 'react';
import JobCard from './myjobs/JobCard';

function JobListCard({ job, onViewDetails }) {
    return <JobCard {...job} onDetails={() => onViewDetails(job)} />;
}

const statusTabs = [
    { value: 'ALL', label: 'All Jobs' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'AWAITING BIDS', label: 'Awaiting Bids' },
    { value: 'IN PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];
const EMPTY_VIEW_STATE = { search: '', statusFilter: 'ALL', categoryFilter: 'ALL', sortBy: 'recent' };

function MyJobs({ jobs = [], viewState, onViewStateChange, onPostJob, onViewDetails, loading = false, error = '', onRetry }) {
    const [localViewState, setLocalViewState] = useState(EMPTY_VIEW_STATE);
    const activeViewState = viewState ?? localViewState;
    const { search = '', statusFilter = 'ALL', categoryFilter = 'ALL', sortBy = 'recent' } = activeViewState;
    const updateViewState = (field, value) => {
        const update = (current) => ({ ...current, [field]: value });
        if (onViewStateChange) onViewStateChange(update);
        else setLocalViewState(update);
    };
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const countFor = (filter) => jobs.filter((job) => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status);
        return job.status === filter;
    }).length;
    const categories = useMemo(() => [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(), [jobs]);
    const visibleJobs = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = jobs.filter((job) => {
            const matchesSearch = !query || [job.title, job.location, job.providerName, job.id].some((value) => String(value || '').toLowerCase().includes(query));
            const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' && ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status)) || job.status === statusFilter;
            return matchesSearch && matchesStatus && (categoryFilter === 'ALL' || job.category === categoryFilter);
        });
        return [...filtered].sort((a, b) => {
            if (sortBy === 'price') return (b.priceValue ?? -1) - (a.priceValue ?? -1);
            const aDate = new Date(a.raw?.createdAt || a.raw?.created_at || 0).getTime();
            const bDate = new Date(b.raw?.createdAt || b.raw?.created_at || 0).getTime();
            if (aDate && bDate && aDate !== bDate) return sortBy === 'oldest' ? aDate - bDate : bDate - aDate;
            return sortBy === 'oldest' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        });
    }, [jobs, search, statusFilter, categoryFilter, sortBy]);
    const activeCount = countFor('ACTIVE');
    const awaitingCount = countFor('AWAITING BIDS');
    const completedCount = countFor('COMPLETED');
    const clearFilters = () => onViewStateChange ? onViewStateChange(EMPTY_VIEW_STATE) : setLocalViewState(EMPTY_VIEW_STATE);

    return (
        <main className="account my-jobs page-surface my-jobs-workspace my-jobs-enter">
            <div className="my-jobs-content">
                <nav className="account-breadcrumb my-jobs-breadcrumb" aria-label="Breadcrumb"><span>FixIt Workspace</span><i className="fa-solid fa-chevron-right" aria-hidden="true"></i><strong>My Jobs</strong></nav>
                <header className="account-header my-jobs-titlebar">
                    <div className="account-heading-copy my-jobs-heading-copy">
                        <p className="my-jobs-eyebrow">YOUR SERVICE REQUESTS</p>
                        <div className="account-title-row my-jobs-heading-line"><h1>My Jobs</h1><span className="my-jobs-total-count">{loading ? 'Loading…' : jobs.length + (jobs.length === 1 ? ' job' : ' total jobs')}</span></div>
                        <p className="my-jobs-subtitle">Track your requests, compare bids and manage completed work.</p>
                    </div>
                    <button type="button" className="account-primary-button my-jobs-post-button" onClick={onPostJob}><i className="fa-solid fa-plus" aria-hidden="true"></i><span>Post a New Job</span></button>
                </header>

                {error ? (
                    <section className="my-jobs-empty my-jobs-state" role="alert">
                        <span><i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></span>
                        <h2>We couldn't load your jobs</h2><p>{error}</p>
                        <button type="button" className="dark-button" onClick={onRetry}>Try again</button>
                    </section>
                ) : (
                    <>
                        <section className="my-jobs-metrics" aria-label="Job summary" aria-busy={loading}>
                            <article className="my-jobs-metric"><div><span>Total Jobs</span><strong>{loading ? '—' : jobs.length}</strong><small>All service requests</small></div><span className="my-jobs-metric-icon"><i className="fa-solid fa-briefcase" aria-hidden="true"></i></span></article>
                            <article className="my-jobs-metric"><div><span>Active Jobs</span><strong>{loading ? '—' : activeCount}</strong><small>{loading ? 'Loading' : Math.max(activeCount - awaitingCount, 0) + ' in progress'}</small></div><span className="my-jobs-metric-icon is-green"><i className="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></span></article>
                            <article className="my-jobs-metric"><div><span>Awaiting Bids</span><strong>{loading ? '—' : awaitingCount}</strong><small>Open requests</small></div><span className="my-jobs-metric-icon is-amber"><i className="fa-solid fa-hourglass-half" aria-hidden="true"></i></span></article>
                            <article className="my-jobs-metric"><div><span>Completed Jobs</span><strong>{loading ? '—' : completedCount}</strong><small>Finished requests</small></div><span className="my-jobs-metric-icon is-blue"><i className="fa-solid fa-circle-check" aria-hidden="true"></i></span></article>
                        </section>
                        <section className="my-jobs-controls" aria-label="Search and filter jobs" aria-busy={loading}>
                            <div className="my-jobs-filter-row">
                                <label className="my-jobs-search"><i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input type="search" value={search} onChange={(event) => updateViewState('search', event.target.value)} placeholder="Search by job title or provider..." aria-label="Search jobs" disabled={loading} /></label>
                                <button type="button" className="my-jobs-filter-toggle" onClick={() => setShowMobileFilters((visible) => !visible)} aria-expanded={showMobileFilters} aria-controls="my-jobs-selects"><i className="fa-solid fa-sliders" aria-hidden="true"></i><span>Filters</span></button>
                                <div id="my-jobs-selects" className={'my-jobs-selects' + (showMobileFilters ? ' is-open' : '')}>
                                    <label><span className="sr-only">Filter by category</span><select value={categoryFilter} onChange={(event) => updateViewState('categoryFilter', event.target.value)} disabled={loading}><option value="ALL">All Categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                                    <label><span className="sr-only">Sort jobs</span><select value={sortBy} onChange={(event) => updateViewState('sortBy', event.target.value)} disabled={loading}><option value="recent">Recent First</option><option value="oldest">Oldest First</option><option value="price">Highest Price</option></select></label>
                                </div>
                            </div>
                            <div className="my-jobs-tabs" role="group" aria-label="Filter by job status">
                                {statusTabs.map(({ value, label }) => <button key={value} type="button" className={statusFilter === value ? 'active' : ''} onClick={() => updateViewState('statusFilter', value)} aria-pressed={statusFilter === value} disabled={loading}><span>{label}</span><span className="my-jobs-tab-count">{loading ? '—' : countFor(value)}</span></button>)}
                            </div>
                        </section>
                        <div className="my-jobs-list-heading"><div><h2>Your requests</h2><span>{loading ? 'Loading' : visibleJobs.length + (visibleJobs.length === 1 ? ' job' : ' jobs')}</span></div><span>Sorted by {sortBy === 'recent' ? 'most recent' : sortBy === 'oldest' ? 'oldest' : 'highest price'}</span></div>
                        <div className="jobs-list my-jobs-list" aria-live="polite" aria-busy={loading}>
                            {loading ? <div className="my-jobs-empty my-jobs-state"><span><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i></span><h2>Loading your jobs</h2><p>Your latest service requests are being retrieved.</p></div> : visibleJobs.map((job) => <JobListCard key={job.id} job={job} onViewDetails={onViewDetails} />)}
                            {!loading && visibleJobs.length === 0 && <div className="my-jobs-empty"><span><i className="fa-solid fa-clipboard-list" aria-hidden="true"></i></span><h2>{jobs.length === 0 ? 'No jobs yet' : 'No matching jobs'}</h2><p>{jobs.length === 0 ? 'You have not posted any service requests yet.' : 'Try changing your search or filters to find the job you need.'}</p>{jobs.length === 0 ? <button type="button" className="dark-button" onClick={onPostJob}>Post your first job</button> : <button type="button" className="outline-button" onClick={clearFilters}>Clear filters</button>}</div>}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default MyJobs;
