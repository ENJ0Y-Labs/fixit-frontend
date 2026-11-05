import { useMemo, useState } from 'react';
import { demoSupportCases, formatSupportStatus, supportPriorities, supportStatuses } from './data/demoSupportCases.js';

const pageSize = 6;

function CaseBadge({ status }) {
    const tone = status === 'RESOLVED' || status === 'CLOSED' ? 'status-success'
        : status === 'UNDER_REVIEW' ? 'status-info'
            : status.startsWith('WAITING') ? 'status-warning' : 'status-danger';
    return <span className={`status-badge ${tone}`}>{formatSupportStatus(status)}</span>;
}

function PriorityBadge({ priority }) {
    const tone = priority === 'Urgent' || priority === 'High' ? 'priority-high'
        : priority === 'Normal' ? 'priority-normal' : 'priority-low';
    return <span className={`support-priority ${tone}`}>{priority}</span>;
}

function formatDate(value) {
    return value.replace(', ', ' · ');
}

export default function DisputesSupportPage() {
    const [records, setRecords] = useState(demoSupportCases);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(demoSupportCases[0]?.id ?? null);
    const [internalNote, setInternalNote] = useState('');
    const [feedback, setFeedback] = useState('');

    const filteredCases = useMemo(() => {
        const term = search.trim().toLowerCase();
        return records.filter((record) => {
            const searchable = [
                record.id, record.subject, record.type, record.category, record.jobId ?? '',
                record.customer ?? '', record.customerId ?? '', record.provider ?? '', record.providerId ?? '',
            ];
            return (!term || searchable.some((value) => value.toLowerCase().includes(term)))
                && (typeFilter === 'All' || record.type === typeFilter)
                && (statusFilter === 'All' || record.status === statusFilter)
                && (priorityFilter === 'All' || record.priority === priorityFilter);
        });
    }, [records, search, typeFilter, statusFilter, priorityFilter]);

    const pageCount = Math.max(1, Math.ceil(filteredCases.length / pageSize));
    const visibleCases = filteredCases.slice((page - 1) * pageSize, page * pageSize);
    const selectedCase = records.find((record) => record.id === selectedId) ?? null;
    const counts = {
        open: records.filter((record) => record.status === 'OPEN').length,
        review: records.filter((record) => record.status === 'UNDER_REVIEW').length,
        waiting: records.filter((record) => record.status.startsWith('WAITING')).length,
        resolved: records.filter((record) => record.status === 'RESOLVED' || record.status === 'CLOSED').length,
        disputes: records.filter((record) => record.type === 'Dispute' && !['RESOLVED', 'CLOSED'].includes(record.status)).length,
    };

    function clearFilters() {
        setSearch('');
        setTypeFilter('All');
        setStatusFilter('All');
        setPriorityFilter('All');
        setPage(1);
    }

    function changeFilter(setter, value) { setter(value); setPage(1); }

    function updateDemoStatus(nextStatus) {
        if (!selectedCase) return;
        setRecords((current) => current.map((record) => record.id === selectedCase.id
            ? { ...record, status: nextStatus, updatedAt: 'Just now' }
            : record));
        setFeedback(`Demo case status changed to “${formatSupportStatus(nextStatus)}”. This change is temporary and is not sent to FixIt servers.`);
    }

    function addInternalNote() {
        if (!internalNote.trim()) {
            setFeedback('Enter a note before adding it to this demo case.');
            return;
        }
        setRecords((current) => current.map((record) => record.id === selectedId
            ? { ...record, messages: [...record.messages, { sender: 'Admin note (demo)', time: 'Just now', body: internalNote.trim() }] }
            : record));
        setInternalNote('');
        setFeedback('Demo note added to this browser session only. It is not private or persisted on a server.');
    }

    return (
        <div className="support-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Disputes &amp; support demo</strong> All cases, messages, people, and activity are illustrative. No real support inbox, customer communication, evidence files, or dispute workflow is connected.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">Customer care &amp; issue resolution</p>
                    <h1>Disputes &amp; support</h1>
                    <p className="page-description">Review reported service issues and support requests across the marketplace.</p>
                </div>
                <span className="date-label">{records.length} illustrative cases</span>
            </section>

            <section className="support-summary" aria-label="Support case summary">
                <article className="metric-card"><p className="metric-label">Open cases</p><strong className="metric-value">{counts.open}</strong><p className="metric-note">Awaiting first review</p></article>
                <article className="metric-card"><p className="metric-label">Under review</p><strong className="metric-value">{counts.review}</strong><p className="metric-note">Being investigated</p></article>
                <article className="metric-card"><p className="metric-label">Waiting on response</p><strong className="metric-value">{counts.waiting}</strong><p className="metric-note">Customer or provider</p></article>
                <article className="metric-card"><p className="metric-label">Resolved / closed</p><strong className="metric-value">{counts.resolved}</strong><p className="metric-note">Sample completed cases</p></article>
                <article className="metric-card"><p className="metric-label">Active disputes</p><strong className="metric-value">{counts.disputes}</strong><p className="metric-note">Service-related reports</p></article>
            </section>

            <section className="panel support-queue" aria-labelledby="support-queue-heading">
                <div className="panel-header support-panel-header">
                    <div><h2 id="support-queue-heading">Case inbox</h2><p>Search and filter disputes and support requests.</p></div>
                    <span className="result-count">{filteredCases.length} case{filteredCases.length === 1 ? '' : 's'}</span>
                </div>
                <div className="support-filters">
                    <label className="provider-search">
                        <span aria-hidden="true">⌕</span>
                        <input type="search" aria-label="Search support cases" placeholder="Search case, subject, customer, provider, or job" value={search} onChange={(event) => changeFilter(setSearch, event.target.value)} />
                    </label>
                    <label className="filter-control"><span>Case type</span><select aria-label="Case type" value={typeFilter} onChange={(event) => changeFilter(setTypeFilter, event.target.value)}><option>All</option><option>Dispute</option><option>Support</option></select></label>
                    <label className="filter-control"><span>Status</span><select aria-label="Case status" value={statusFilter} onChange={(event) => changeFilter(setStatusFilter, event.target.value)}><option value="All">All statuses</option>{supportStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                    <label className="filter-control"><span>Priority</span><select aria-label="Case priority" value={priorityFilter} onChange={(event) => changeFilter(setPriorityFilter, event.target.value)}><option>All</option>{supportPriorities.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <button className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button>
                </div>
                <div className="support-table-wrap">
                    <table className="activity-table support-table">
                        <thead><tr><th scope="col">Case</th><th scope="col">Type</th><th scope="col">Reported by</th><th scope="col">Priority</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col"><span className="sr-only">Details</span></th></tr></thead>
                        <tbody>
                            {visibleCases.map((record) => (
                                <tr key={record.id} className={selectedId === record.id ? 'is-selected' : ''}>
                                    <td><strong>{record.subject}</strong><small>{record.id} · {record.jobId ?? record.category}</small></td>
                                    <td><span className={record.type === 'Dispute' ? 'support-type dispute' : 'support-type'}>{record.type}</span></td>
                                    <td><strong>{record.customer ?? record.provider ?? 'Not specified'}</strong><small>{record.customer ? 'Customer' : record.provider ? 'Provider' : 'Unknown in sample'}</small></td>
                                    <td><PriorityBadge priority={record.priority} /></td>
                                    <td><CaseBadge status={record.status} /></td>
                                    <td className="date-cell">{formatDate(record.updatedAt)}</td>
                                    <td><button className="provider-view-button" type="button" onClick={() => { setSelectedId(record.id); setFeedback(''); setInternalNote(''); }}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleCases.length === 0 && <div className="provider-empty" role="status"><strong>No cases match these filters</strong><p>Try another search term or filter combination.</p><button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button></div>}
                </div>
                <div className="provider-pagination">
                    <span>Showing {filteredCases.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredCases.length)} of {filteredCases.length}</span>
                    <div className="pagination-actions">
                        <button className="pagination-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                        <span aria-live="polite">Page {page} of {pageCount}</span>
                        <button className="pagination-button" type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </div>
            </section>

            {selectedCase && (
                <section className="panel support-detail" aria-labelledby="support-detail-heading">
                    <div className="panel-header support-detail-header">
                        <div><p className="eyebrow">{selectedCase.id} · {selectedCase.type}</p><h2 id="support-detail-heading">{selectedCase.subject}</h2><p>{selectedCase.category} {selectedCase.jobId ? `· Job ${selectedCase.jobId}` : ''}</p></div>
                        <div className="support-detail-badges"><PriorityBadge priority={selectedCase.priority} /><CaseBadge status={selectedCase.status} /></div>
                    </div>
                    <p className="support-case-summary">{selectedCase.summary}</p>
                    <div className="support-participants">
                        <div><span>Customer</span><strong>{selectedCase.customer ?? 'Not linked in sample'}</strong><small>{selectedCase.customerId ?? 'No customer ID'}</small></div>
                        <div><span>Provider</span><strong>{selectedCase.provider ?? 'Not linked in sample'}</strong><small>{selectedCase.providerId ?? 'No provider ID'}</small></div>
                        <div><span>Assigned to</span><strong>{selectedCase.assignedTo}</strong><small>Illustrative assignment</small></div>
                        <div><span>Created</span><strong>{selectedCase.createdAt}</strong><small>Last activity: {selectedCase.updatedAt}</small></div>
                    </div>
                    <div className="support-detail-grid">
                        <section className="support-conversation" aria-labelledby="support-conversation-heading">
                            <div className="support-section-heading"><div><h3 id="support-conversation-heading">Case activity</h3><p>Illustrative messages and admin notes.</p></div></div>
                            <div className="support-timeline">
                                {selectedCase.messages.map((message, index) => <article className="support-message" key={`${selectedCase.id}-${index}`}><div><strong>{message.sender}</strong><time>{message.time}</time></div><p>{message.body}</p></article>)}
                            </div>
                            <label className="support-note-field"><span>Add internal note (demo)</span><textarea rows="3" value={internalNote} onChange={(event) => { setInternalNote(event.target.value); setFeedback(''); }} placeholder="Write a note for this sample case..." /></label>
                            <button className="verification-action request" type="button" onClick={addInternalNote}>Add note (demo)</button>
                            {feedback && <p className="verification-feedback" role="status">{feedback}</p>}
                        </section>
                        <aside className="support-side-panel">
                            <div className="support-section-heading"><div><h3>Evidence checklist</h3><p>Metadata only. No files are attached.</p></div></div>
                            <ul className="support-evidence-list">{selectedCase.evidence.map((item) => <li key={item}><span aria-hidden="true">▤</span>{item}</li>)}</ul>
                            <div className="support-section-heading support-actions-heading"><div><h3>Demo case controls</h3><p>Local preview only. No real case changes.</p></div></div>
                            <label className="filter-control"><span>Update sample status</span><select aria-label="Demo case status" value={selectedCase.status} onChange={(event) => updateDemoStatus(event.target.value)}>{supportStatuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                            <p className="support-readonly-note">Changing this status only updates temporary browser state. It does not contact either party, assign a case, issue a refund, or resolve a real dispute.</p>
                        </aside>
                    </div>
                </section>
            )}
        </div>
    );
}
