import './styles/pages/my-jobs.css';
import { useMemo, useState } from 'react';
import JobCard from './myjobs/JobCard';

const statusTabs = [
    { value: 'ALL', label: 'All Jobs' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'AWAITING BIDS', label: 'Awaiting Bids' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

function MyJobs({ jobs = [], onPostJob, onViewDetails, onOpenMessages }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('recent');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const countFor = (filter) => jobs.filter((job) => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status);
        return job.status === filter;
    }).length;

    const categories = useMemo(
        () => [...new Set(jobs.map((job) => job.category).filter(Boolean))].sort(),
        [jobs],
    );

    const visibleJobs = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = jobs.filter((job) => {
            const matchesSearch = !query
                || job.title.toLowerCase().includes(query)
                || job.location.toLowerCase().includes(query)
                || (job.providerName || '').toLowerCase().includes(query)
                || job.id.toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'ALL'
                || (statusFilter === 'ACTIVE' && ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status))
                || job.status === statusFilter;
            const matchesCategory = categoryFilter === 'ALL' || job.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === 'oldest') return a.id.localeCompare(b.id);
            if (sortBy === 'price') return (b.priceValue || 0) - (a.priceValue || 0);
            return b.id.localeCompare(a.id);
        });
    }, [jobs, search, statusFilter, categoryFilter, sortBy]);

    const activeCount = countFor('ACTIVE');
    const awaitingCount = countFor('AWAITING BIDS');
    const completedCount = countFor('COMPLETED');

    return (
        <div className="my-jobs page-surface my-jobs-workspace">
            <div className="my-jobs-content">
                <div className="my-jobs-breadcrumb">
                    <span>FixIt Workspace</span>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    <strong>My Jobs</strong>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    <span>Overview</span>
                </div>

                <header className="my-jobs-titlebar">
                    <div>
                        <p className="my-jobs-eyebrow">YOUR SERVICE REQUESTS</p>
                        <h1>My Jobs</h1>
                        <p className="my-jobs-subtitle">Manage your service requests, bids, ongoing work and booking history.</p>
                    </div>
                    <button type="button" className="dark-button my-jobs-post-button" onClick={onPostJob}>
                        <i className="fa-solid fa-plus" aria-hidden="true"></i>
                        <span>Post a New Job</span>
                    </button>
                </header>

                <section className="my-jobs-metrics" aria-label="Job summary">
                    <article className="my-jobs-metric">
                        <div><span>Total Jobs</span><strong>{jobs.length}</strong><small>All your service requests</small></div>
                        <span className="my-jobs-metric-icon"><i className="fa-solid fa-briefcase" aria-hidden="true"></i></span>
                    </article>
                    <article className="my-jobs-metric">
                        <div><span>Active Jobs</span><strong>{activeCount}</strong><small>{Math.max(activeCount - awaitingCount, 0)} in progress</small></div>
                        <span className="my-jobs-metric-icon is-green"><i className="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i></span>
                    </article>
                    <article className="my-jobs-metric">
                        <div><span>Awaiting Bids</span><strong>{awaitingCount}</strong><small>Requests open to providers</small></div>
                        <span className="my-jobs-metric-icon is-amber"><i className="fa-solid fa-hourglass-half" aria-hidden="true"></i></span>
                    </article>
                    <article className="my-jobs-metric">
                        <div><span>Completed Jobs</span><strong>{completedCount}</strong><small>Finished service requests</small></div>
                        <span className="my-jobs-metric-icon is-blue"><i className="fa-solid fa-circle-check" aria-hidden="true"></i></span>
                    </article>
                </section>

                <section className="my-jobs-controls" aria-label="Filter jobs">
                    <div className="my-jobs-tabs" role="group" aria-label="Filter by job status">
                        {statusTabs.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                className={statusFilter === value ? 'active' : ''}
                                onClick={() => setStatusFilter(value)}
                                aria-pressed={statusFilter === value}
                            >
                                <span>{label}</span>
                                <span className="my-jobs-tab-count">{countFor(value)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="my-jobs-filter-row">
                        <label className="my-jobs-search">
                            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search job ID, title, location or provider..."
                                aria-label="Search jobs"
                            />
                        </label>
                        <button
                            type="button"
                            className="my-jobs-filter-toggle"
                            onClick={() => setShowMobileFilters((visible) => !visible)}
                            aria-expanded={showMobileFilters}
                        >
                            <i className="fa-solid fa-sliders" aria-hidden="true"></i>
                            <span>Filters</span>
                        </button>
                        <div className={`my-jobs-selects${showMobileFilters ? ' is-open' : ''}`}>
                            <label>
                                <span className="sr-only">Filter by category</span>
                                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                                    <option value="ALL">All Categories</option>
                                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                </select>
                            </label>
                            <label>
                                <span className="sr-only">Sort jobs</span>
                                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                                    <option value="recent">Recent First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price">Highest Price</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </section>

                <div className="my-jobs-list-heading">
                    <div><h2>Your requests</h2><span>{visibleJobs.length} {visibleJobs.length === 1 ? 'job' : 'jobs'}</span></div>
                    <span>Sorted by {sortBy === 'recent' ? 'most recent' : sortBy === 'oldest' ? 'oldest' : 'highest price'}</span>
                </div>

                <div className="jobs-list my-jobs-list">
                    {visibleJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            {...job}
                            onDetails={() => onViewDetails(job)}
                            onChat={() => onOpenMessages(job)}
                        />
                    ))}
                    {visibleJobs.length === 0 && (
                        <div className="my-jobs-empty">
                            <span><i className="fa-solid fa-clipboard-list" aria-hidden="true"></i></span>
                            <h2>{jobs.length === 0 ? 'No jobs yet' : 'No matching jobs'}</h2>
                            <p>{jobs.length === 0 ? 'Post your first job to start receiving responses from service providers.' : 'Try changing your search or filters to find the job you need.'}</p>
                            {jobs.length === 0
                                ? <button type="button" className="dark-button" onClick={onPostJob}>Post your first job</button>
                                : <button type="button" className="outline-button" onClick={() => { setSearch(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); }}>Clear filters</button>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyJobs;
