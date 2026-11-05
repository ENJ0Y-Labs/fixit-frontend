import { useMemo, useState } from 'react';
import { demoJobs, formatJobStatus, jobStatuses } from './data/demoJobs.js';

const pageSize = 6;
const formatNaira = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', maximumFractionDigits: 0,
}).format(amount);

function JobStatusBadge({ status }) {
    const className = status === 'COMPLETED' ? 'status-success'
        : status === 'CANCELLED' ? 'status-danger'
            : status === 'IN_PROGRESS' ? 'status-info' : 'status-warning';
    return <span className={`status-badge ${className}`}>{formatJobStatus(status)}</span>;
}

export default function JobsPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [category, setCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(demoJobs[0]?.id ?? null);

    const categories = useMemo(() => [...new Set(demoJobs.map((job) => job.category))].sort(), []);
    const filteredJobs = useMemo(() => {
        const term = search.trim().toLowerCase();
        return demoJobs.filter((job) => {
            const matchesSearch = !term || [
                job.id, job.title, job.category, job.customer, job.customerId,
                job.provider ?? '', job.providerId ?? '', job.location,
            ].some((value) => value.toLowerCase().includes(term));
            return matchesSearch && (status === 'All' || job.status === status)
                && (category === 'All' || job.category === category);
        });
    }, [search, status, category]);

    const pageCount = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
    const visibleJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
    const selectedJob = demoJobs.find((job) => job.id === selectedId) ?? null;
    const counts = jobStatuses.reduce((result, item) => {
        result[item.value] = demoJobs.filter((job) => job.status === item.value).length;
        return result;
    }, {});

    function clearFilters() {
        setSearch('');
        setStatus('All');
        setCategory('All');
        setPage(1);
    }

    function updateSearch(value) { setSearch(value); setPage(1); }
    function updateStatus(value) { setStatus(value); setPage(1); }
    function updateCategory(value) { setCategory(value); setPage(1); }

    return (
        <div className="jobs-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Jobs demo</strong> All job, customer, provider, amount, and activity details are illustrative sample records, not live marketplace data. This workspace is read-only.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">Marketplace operations</p>
                    <h1>Jobs</h1>
                    <p className="page-description">Monitor job activity, assignments, locations, and status across the FixIt marketplace.</p>
                </div>
                <span className="date-label">12 illustrative records</span>
            </section>

            <section className="jobs-summary" aria-label="Job status summary">
                <article className="metric-card"><p className="metric-label">Total jobs</p><strong className="metric-value">{demoJobs.length}</strong><p className="metric-note">Sample records</p></article>
                <article className="metric-card"><p className="metric-label">Awaiting bids</p><strong className="metric-value">{counts.AWAITING_BIDS}</strong><p className="metric-note">Open for responses</p></article>
                <article className="metric-card"><p className="metric-label">In progress</p><strong className="metric-value">{counts.IN_PROGRESS}</strong><p className="metric-note">Assigned and underway</p></article>
                <article className="metric-card"><p className="metric-label">Completed</p><strong className="metric-value">{counts.COMPLETED}</strong><p className="metric-note">Marked complete in sample</p></article>
                <article className="metric-card"><p className="metric-label">Cancelled</p><strong className="metric-value">{counts.CANCELLED}</strong><p className="metric-note">Cancelled sample records</p></article>
            </section>

            <section className="panel jobs-queue" aria-labelledby="jobs-queue-heading">
                <div className="panel-header jobs-panel-header">
                    <div><h2 id="jobs-queue-heading">Marketplace jobs</h2><p>Search and inspect job records without changing their state.</p></div>
                    <span className="result-count">{filteredJobs.length} job{filteredJobs.length === 1 ? '' : 's'}</span>
                </div>
                <div className="jobs-filters">
                    <label className="provider-search">
                        <span aria-hidden="true">⌕</span>
                        <input type="search" aria-label="Search jobs" placeholder="Search job, customer, provider, or location" value={search} onChange={(event) => updateSearch(event.target.value)} />
                    </label>
                    <label className="filter-control">
                        <span>Job status</span>
                        <select aria-label="Job status" value={status} onChange={(event) => updateStatus(event.target.value)}>
                            <option value="All">All statuses</option>
                            {jobStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                    </label>
                    <label className="filter-control">
                        <span>Category</span>
                        <select aria-label="Job category" value={category} onChange={(event) => updateCategory(event.target.value)}>
                            <option value="All">All categories</option>
                            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </label>
                    <button className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button>
                </div>
                <div className="jobs-table-wrap">
                    <table className="activity-table jobs-table">
                        <thead><tr><th scope="col">Job</th><th scope="col">Customer</th><th scope="col">Provider</th><th scope="col">Location</th><th scope="col">Status</th><th scope="col">Budget</th><th scope="col"><span className="sr-only">Details</span></th></tr></thead>
                        <tbody>
                            {visibleJobs.map((job) => (
                                <tr key={job.id} className={selectedId === job.id ? 'is-selected' : ''}>
                                    <td><strong>{job.title}</strong><small>{job.id} · {job.category}</small></td>
                                    <td><strong>{job.customer}</strong><small>{job.customerId}</small></td>
                                    <td>{job.provider ? <><strong>{job.provider}</strong><small>{job.providerId}</small></> : <span className="job-unassigned">Not assigned</span>}</td>
                                    <td>{job.location}</td>
                                    <td><JobStatusBadge status={job.status} /></td>
                                    <td className="amount-cell">{formatNaira(job.budget)}</td>
                                    <td><button className="provider-view-button" type="button" onClick={() => setSelectedId(job.id)}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleJobs.length === 0 && <div className="provider-empty" role="status"><strong>No jobs match these filters</strong><p>Try another search term, status, or category.</p><button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button></div>}
                </div>
                <div className="provider-pagination">
                    <span>Showing {filteredJobs.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredJobs.length)} of {filteredJobs.length}</span>
                    <div className="pagination-actions">
                        <button className="pagination-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                        <span aria-live="polite">Page {page} of {pageCount}</span>
                        <button className="pagination-button" type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </div>
            </section>

            {selectedJob && (
                <section className="panel jobs-detail" aria-labelledby="jobs-detail-heading">
                    <div className="panel-header">
                        <div><p className="eyebrow">Job {selectedJob.id}</p><h2 id="jobs-detail-heading">{selectedJob.title}</h2><p>{selectedJob.category} · {selectedJob.location}</p></div>
                        <JobStatusBadge status={selectedJob.status} />
                    </div>
                    <p className="jobs-description">{selectedJob.description}</p>
                    <div className="jobs-detail-grid">
                        <div><span>Customer</span><strong>{selectedJob.customer}</strong><small>{selectedJob.customerId}</small></div>
                        <div><span>Assigned provider</span><strong>{selectedJob.provider ?? 'Not assigned'}</strong><small>{selectedJob.providerId ?? 'No provider ID in sample'}</small></div>
                        <div><span>Customer budget</span><strong>{formatNaira(selectedJob.budget)}</strong><small>Illustrative requested amount, not a confirmed payment</small></div>
                        <div><span>Bid responses</span><strong>{selectedJob.bids}</strong><small>Sample count only</small></div>
                        <div><span>Created</span><strong>{selectedJob.createdAt}</strong></div>
                        <div><span>Last activity</span><strong>{selectedJob.updatedAt}</strong></div>
                    </div>
                    <p className="jobs-readonly-note">Read-only demo details. No job assignment, cancellation, status change, payment, or customer/provider notification is performed here.</p>
                </section>
            )}
        </div>
    );
}
