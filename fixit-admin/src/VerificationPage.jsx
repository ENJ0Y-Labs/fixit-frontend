import { useMemo, useState } from 'react';

import { demoVerificationCases } from './data/demoVerificationCases.js';

const pageSize = 5;
const statuses = ['All', 'Pending review', 'Needs information', 'Approved', 'Rejected'];

function VerificationBadge({ status }) {
    const className = status === 'Approved' ? 'status-success'
        : status === 'Rejected' ? 'status-danger'
            : status === 'Needs information' ? 'status-warning' : 'status-info';
    return <span className={`status-badge ${className}`}>{status}</span>;
}

function DocumentStatus({ status }) {
    const className = status === 'Submitted' ? 'status-success'
        : status === 'Not required' ? 'status-info'
            : 'status-warning';
    return <span className={`status-badge ${className}`}>{status}</span>;
}

export default function VerificationPage() {
    const [records, setRecords] = useState(demoVerificationCases);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending review');
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(demoVerificationCases[0]?.id ?? null);
    const [reviewNote, setReviewNote] = useState('');
    const [feedback, setFeedback] = useState('');

    const filteredRecords = useMemo(() => {
        const term = search.trim().toLowerCase();
        return records.filter((record) => {
            const matchesSearch = !term || [
                record.id, record.providerId, record.provider, record.business, record.service, record.location,
            ].some((value) => value.toLowerCase().includes(term));
            return matchesSearch && (statusFilter === 'All' || record.status === statusFilter);
        });
    }, [records, search, statusFilter]);

    const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
    const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
    const selectedRecord = records.find((record) => record.id === selectedId) ?? null;
    const counts = {
        pending: records.filter((record) => record.status === 'Pending review').length,
        information: records.filter((record) => record.status === 'Needs information').length,
        approved: records.filter((record) => record.status === 'Approved').length,
        rejected: records.filter((record) => record.status === 'Rejected').length,
    };

    function changeSearch(value) {
        setSearch(value);
        setPage(1);
        setFeedback('');
    }

    function changeStatus(value) {
        setStatusFilter(value);
        setPage(1);
        setFeedback('');
    }

    function selectRecord(record) {
        setSelectedId(record.id);
        setReviewNote('');
        setFeedback('');
    }

    function applyDemoDecision(nextStatus) {
        if (!selectedRecord) return;
        if (nextStatus !== 'Approved' && !reviewNote.trim()) {
            setFeedback('Add a review note before requesting information or rejecting this sample case.');
            return;
        }
        setRecords((current) => current.map((record) => (
            record.id === selectedRecord.id ? { ...record, status: nextStatus } : record
        )));
        setStatusFilter('All');
        setPage(1);
        setFeedback(`Demo state changed to “${nextStatus}”. This change exists only in this browser session.`);
        setReviewNote('');
    }

    function resetDemo() {
        setRecords(demoVerificationCases);
        setSearch('');
        setStatusFilter('Pending review');
        setPage(1);
        setSelectedId(demoVerificationCases[0]?.id ?? null);
        setReviewNote('');
        setFeedback('Illustrative verification cases have been reset.');
    }

    return (
        <div className="verification-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Verification demo</strong> All providers, document names, and review outcomes are illustrative. No real documents are attached, and demo decisions are not saved or sent to providers.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">Trust & safety</p>
                    <h1>Provider verification</h1>
                    <p className="page-description">Review submitted identity and business evidence before providers are verified.</p>
                </div>
                <button className="btn btn-secondary verification-reset" type="button" onClick={resetDemo}>Reset demo data</button>
            </section>

            <section className="verification-summary" aria-label="Verification queue summary">
                <article className="metric-card"><p className="metric-label">Pending review</p><strong className="metric-value">{counts.pending}</strong><p className="metric-note">Awaiting admin review</p></article>
                <article className="metric-card"><p className="metric-label">Needs information</p><strong className="metric-value">{counts.information}</strong><p className="metric-note">Sample follow-up state</p></article>
                <article className="metric-card"><p className="metric-label">Approved</p><strong className="metric-value">{counts.approved}</strong><p className="metric-note">Sample approved cases</p></article>
                <article className="metric-card"><p className="metric-label">Rejected</p><strong className="metric-value">{counts.rejected}</strong><p className="metric-note">Sample rejected cases</p></article>
            </section>

            <section className="panel verification-queue" aria-labelledby="verification-queue-heading">
                <div className="panel-header verification-panel-header">
                    <div>
                        <h2 id="verification-queue-heading">Verification queue</h2>
                        <p>Choose a case to inspect its submitted document checklist.</p>
                    </div>
                    <span className="result-count">{filteredRecords.length} case{filteredRecords.length === 1 ? '' : 's'}</span>
                </div>

                <div className="verification-filters">
                    <label className="provider-search">
                        <span aria-hidden="true">⌕</span>
                        <input type="search" aria-label="Search verification cases" placeholder="Search provider, business, or case ID" value={search} onChange={(event) => changeSearch(event.target.value)} />
                    </label>
                    <label className="filter-control">
                        <span>Review status</span>
                        <select aria-label="Verification status" value={statusFilter} onChange={(event) => changeStatus(event.target.value)}>
                            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </label>
                    <button className="clear-filters" type="button" onClick={() => { setSearch(''); changeStatus('All'); }}>Clear filters</button>
                </div>

                <div className="verification-table-wrap">
                    <table className="activity-table verification-table">
                        <thead><tr><th scope="col">Provider</th><th scope="col">Service</th><th scope="col">Submitted</th><th scope="col">Documents</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Review</span></th></tr></thead>
                        <tbody>
                            {visibleRecords.map((record) => (
                                <tr key={record.id} className={selectedId === record.id ? 'is-selected' : ''}>
                                    <td><strong>{record.provider}</strong><small>{record.id} · {record.providerId}</small></td>
                                    <td>{record.service}</td>
                                    <td className="date-cell">{record.submitted}</td>
                                    <td>{record.documents.filter((document) => document.status === 'Submitted').length} of {record.documents.length} submitted</td>
                                    <td><VerificationBadge status={record.status} /></td>
                                    <td><button className="provider-view-button" type="button" onClick={() => selectRecord(record)}>Review</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleRecords.length === 0 && (
                        <div className="provider-empty" role="status">
                            <strong>No verification cases found</strong>
                            <p>Try a different search or status filter.</p>
                            <button className="btn btn-secondary" type="button" onClick={() => { setSearch(''); changeStatus('All'); }}>Clear filters</button>
                        </div>
                    )}
                </div>
                <div className="provider-pagination">
                    <span>Showing {filteredRecords.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRecords.length)} of {filteredRecords.length}</span>
                    <div className="pagination-actions">
                        <button className="pagination-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                        <span aria-live="polite">Page {page} of {pageCount}</span>
                        <button className="pagination-button" type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </div>
            </section>

            {selectedRecord && (
                <section className="panel verification-review" aria-labelledby="verification-review-heading">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Case {selectedRecord.id}</p>
                            <h2 id="verification-review-heading">{selectedRecord.provider}</h2>
                            <p>{selectedRecord.business} · {selectedRecord.location}</p>
                        </div>
                        <VerificationBadge status={selectedRecord.status} />
                    </div>

                    <div className="verification-provider-meta">
                        <div><span>Provider ID</span><strong>{selectedRecord.providerId}</strong></div>
                        <div><span>Service category</span><strong>{selectedRecord.service}</strong></div>
                        <div><span>Submitted on</span><strong>{selectedRecord.submitted}</strong></div>
                    </div>

                    <div className="verification-documents">
                        <div className="verification-section-heading">
                            <div><h3>Document checklist</h3><p>Sample document metadata only. File previews are not available in this demo.</p></div>
                        </div>
                        {selectedRecord.documents.map((document) => (
                            <article className="verification-document" key={document.name}>
                                <span className="verification-file-icon" aria-hidden="true">▤</span>
                                <div className="verification-document-copy">
                                    <strong>{document.name}</strong>
                                    <small>{document.fileName}</small>
                                    <p>{document.note}</p>
                                </div>
                                <DocumentStatus status={document.status} />
                            </article>
                        ))}
                    </div>

                    <div className="verification-decision">
                        <div className="verification-section-heading">
                            <div><h3>Review decision</h3><p>Demo-only controls. These actions do not change a real provider account.</p></div>
                        </div>
                        <label className="verification-note-field">
                            <span>Review note {selectedRecord.status !== 'Approved' ? '(required for request or rejection)' : '(optional)'}</span>
                            <textarea rows="3" value={reviewNote} onChange={(event) => { setReviewNote(event.target.value); setFeedback(''); }} placeholder="Record what was checked or what information is missing..." />
                        </label>
                        <div className="verification-actions">
                            <button className="verification-action approve" type="button" onClick={() => applyDemoDecision('Approved')}>Approve (demo)</button>
                            <button className="verification-action request" type="button" onClick={() => applyDemoDecision('Needs information')}>Request information (demo)</button>
                            <button className="verification-action reject" type="button" onClick={() => applyDemoDecision('Rejected')}>Reject (demo)</button>
                        </div>
                        {feedback && <p className="verification-feedback" role="status">{feedback}</p>}
                    </div>
                </section>
            )}
        </div>
    );
}
