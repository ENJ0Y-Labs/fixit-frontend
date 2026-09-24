import { useMemo, useState } from 'react';
import JobCard from './myjobs/JobCard';

function MyJobs({ jobs = [], onPostJob, onViewDetails, onOpenMessages }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('recent');

    const visibleJobs = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = jobs.filter((job) => {
            const matchesSearch = !query
                || job.title.toLowerCase().includes(query)
                || job.location.toLowerCase().includes(query)
                || (job.providerName || '').toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'ALL'
                || (statusFilter === 'ACTIVE' && ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status))
                || job.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === 'oldest') return a.id.localeCompare(b.id);
            if (sortBy === 'price') return (b.priceValue || 0) - (a.priceValue || 0);
            return b.id.localeCompare(a.id);
        });
    }, [jobs, search, statusFilter, sortBy]);

    const countFor = (filter) => jobs.filter((job) => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return ['IN PROGRESS', 'AWAITING BIDS'].includes(job.status);
        return job.status === filter;
    }).length;

    return (
        <div className="my-jobs page-surface">
            <header className="page-header my-jobs-header">
                <h1>My Jobs</h1>
                <div className="my-jobs-actions">
                    <div className="compact-search">
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs" aria-label="Search jobs" />
                    </div>
                    <button type="button" className="dark-button" onClick={onPostJob}>Post New Job</button>
                </div>
            </header>

            <main className="my-jobs-main">
                <div className="jobs-toolbar">
                    <div className="job-status-tabs">
                        {[
                            ['ALL', 'All Jobs'],
                            ['ACTIVE', 'Active'],
                            ['COMPLETED', 'Completed'],
                            ['CANCELLED', 'Cancelled'],
                        ].map(([value, label]) => (
                            <button key={value} type="button" className={statusFilter === value ? 'active' : ''} onClick={() => setStatusFilter(value)}>
                                {label} ({countFor(value)})
                            </button>
                        ))}
                    </div>
                    <label className="job-sort">
                        <i className="fa-solid fa-arrow-down-wide-short" aria-hidden="true"></i>
                        Sort:
                        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort jobs">
                            <option value="recent">Recent First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price">Highest Price</option>
                        </select>
                    </label>
                </div>

                <div className="jobs-list">
                    {visibleJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            {...job}
                            onDetails={() => onViewDetails(job)}
                            onChat={() => onOpenMessages(job)}
                        />
                    ))}
                    {visibleJobs.length === 0 && <p className="empty-state">No jobs match your current search or filter.</p>}
                </div>
            </main>
        </div>
    );
}

export default MyJobs;
