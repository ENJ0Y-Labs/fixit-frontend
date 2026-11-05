import { useMemo, useState } from 'react';

import { demoProviders } from './data/demoProviders.js';

const pageSize = 5;

function VerificationBadge({ status }) {
    const tone = status === 'Verified' ? 'status-success' : status === 'Rejected' ? 'status-danger' : 'status-warning';
    return <span className={`status-badge ${tone}`}>{status}</span>;
}

function AccountBadge({ status }) {
    return <span className={`status-badge ${status === 'Active' ? 'status-info' : 'status-danger'}`}>{status}</span>;
}

export default function ProvidersPage() {
    const [search, setSearch] = useState('');
    const [verification, setVerification] = useState('All');
    const [account, setAccount] = useState('All');
    const [category, setCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const categories = useMemo(() => [...new Set(demoProviders.map((provider) => provider.category))].sort(), []);

    const filteredProviders = useMemo(() => {
        const term = search.trim().toLowerCase();
        return demoProviders.filter((provider) => {
            const matchesSearch = !term || [provider.id, provider.name, provider.business, provider.location, provider.email]
                .some((value) => value.toLowerCase().includes(term));
            return matchesSearch
                && (verification === 'All' || provider.verification === verification)
                && (account === 'All' || provider.account === account)
                && (category === 'All' || provider.category === category);
        });
    }, [search, verification, account, category]);

    const pageCount = Math.max(1, Math.ceil(filteredProviders.length / pageSize));
    const visibleProviders = filteredProviders.slice((page - 1) * pageSize, page * pageSize);
    const firstItem = filteredProviders.length ? (page - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(page * pageSize, filteredProviders.length);

    function updateFilter(setter, value) {
        setter(value);
        setPage(1);
        setSelectedProvider(null);
    }

    function clearFilters() {
        setSearch('');
        setVerification('All');
        setAccount('All');
        setCategory('All');
        setPage(1);
        setSelectedProvider(null);
    }

    return (
        <div className="providers-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Demo records</strong> Provider profiles and counts below are illustrative only. No live provider data or admin actions are connected.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">People management</p>
                    <h1>Providers</h1>
                    <p className="page-description">Review provider accounts, service details, and verification status.</p>
                </div>
                <span className="date-label">12 sample provider profiles</span>
            </section>

            <section className="provider-summary" aria-label="Provider summary">
                <article className="metric-card">
                    <p className="metric-label">Total providers</p>
                    <strong className="metric-value">{demoProviders.length}</strong>
                    <p className="metric-note">Illustrative records</p>
                </article>
                <article className="metric-card">
                    <p className="metric-label">Verified profiles</p>
                    <strong className="metric-value">{demoProviders.filter((provider) => provider.verification === 'Verified').length}</strong>
                    <p className="metric-note">Sample verification status</p>
                </article>
                <article className="metric-card">
                    <p className="metric-label">Awaiting review</p>
                    <strong className="metric-value">{demoProviders.filter((provider) => provider.verification === 'Pending review').length}</strong>
                    <p className="metric-note">Sample queue count</p>
                </article>
                <article className="metric-card">
                    <p className="metric-label">Suspended accounts</p>
                    <strong className="metric-value">{demoProviders.filter((provider) => provider.account === 'Suspended').length}</strong>
                    <p className="metric-note">Sample account status</p>
                </article>
            </section>

            <section className="panel providers-panel" aria-labelledby="provider-list-heading">
                <div className="panel-header providers-panel-header">
                    <div>
                        <h2 id="provider-list-heading">All providers</h2>
                        <p>Search and narrow the sample provider directory.</p>
                    </div>
                    <span className="result-count">{filteredProviders.length} result{filteredProviders.length === 1 ? '' : 's'}</span>
                </div>

                <div className="provider-filters">
                    <label className="provider-search">
                        <span className="sr-only">Search providers</span>
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => updateFilter(setSearch, event.target.value)}
                            placeholder="Search name, business, ID, or location"
                        />
                    </label>
                    <label className="filter-control">
                        <span>Verification</span>
                        <select value={verification} onChange={(event) => updateFilter(setVerification, event.target.value)}>
                            <option>All</option>
                            <option>Verified</option>
                            <option>Pending review</option>
                            <option>Rejected</option>
                        </select>
                    </label>
                    <label className="filter-control">
                        <span>Account</span>
                        <select value={account} onChange={(event) => updateFilter(setAccount, event.target.value)}>
                            <option>All</option>
                            <option>Active</option>
                            <option>Suspended</option>
                        </select>
                    </label>
                    <label className="filter-control">
                        <span>Service</span>
                        <select value={category} onChange={(event) => updateFilter(setCategory, event.target.value)}>
                            <option>All</option>
                            {categories.map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </label>
                    <button className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button>
                </div>

                <div className="table-wrap providers-table-wrap">
                    <table className="activity-table providers-table">
                        <thead>
                            <tr>
                                <th scope="col">Provider</th>
                                <th scope="col">Service</th>
                                <th scope="col">Location</th>
                                <th scope="col">Verification</th>
                                <th scope="col">Account</th>
                                <th scope="col">Rating</th>
                                <th scope="col"><span className="sr-only">Details</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleProviders.map((provider) => (
                                <tr key={provider.id}>
                                    <td>
                                        <strong>{provider.name}</strong>
                                        <small>{provider.id} · {provider.business}</small>
                                    </td>
                                    <td>{provider.category}</td>
                                    <td>{provider.location}</td>
                                    <td><VerificationBadge status={provider.verification} /></td>
                                    <td><AccountBadge status={provider.account} /></td>
                                    <td className="provider-rating">{provider.rating.toFixed(1)} <span aria-label="out of 5 stars">★</span></td>
                                    <td><button className="provider-view-button" type="button" onClick={() => setSelectedProvider(provider)}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleProviders.length === 0 && (
                        <div className="provider-empty" role="status">
                            <strong>No providers match these filters</strong>
                            <p>Try a different search term or clear the selected filters.</p>
                            <button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button>
                        </div>
                    )}
                </div>

                <div className="provider-pagination">
                    <span>Showing {firstItem}–{lastItem} of {filteredProviders.length}</span>
                    <div className="pagination-actions">
                        <button type="button" className="pagination-button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                        <span aria-live="polite">Page {page} of {pageCount}</span>
                        <button type="button" className="pagination-button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </div>
            </section>

            {selectedProvider && (
                <section className="panel provider-detail" aria-labelledby="provider-detail-heading">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Provider profile · {selectedProvider.id}</p>
                            <h2 id="provider-detail-heading">{selectedProvider.name}</h2>
                            <p>{selectedProvider.business}</p>
                        </div>
                        <button className="provider-close-button" type="button" onClick={() => setSelectedProvider(null)}>Close details</button>
                    </div>
                    <div className="provider-detail-grid">
                        <div><span>Service category</span><strong>{selectedProvider.category}</strong></div>
                        <div><span>Location</span><strong>{selectedProvider.location}</strong></div>
                        <div><span>Phone</span><strong>{selectedProvider.phone}</strong></div>
                        <div><span>Email</span><strong>{selectedProvider.email}</strong></div>
                        <div><span>Completed jobs</span><strong>{selectedProvider.jobs}</strong></div>
                        <div><span>Average rating</span><strong>{selectedProvider.rating.toFixed(1)} / 5</strong></div>
                        <div><span>Joined</span><strong>{selectedProvider.joined}</strong></div>
                        <div><span>Verification</span><strong><VerificationBadge status={selectedProvider.verification} /></strong></div>
                        <div><span>Account status</span><strong><AccountBadge status={selectedProvider.account} /></strong></div>
                    </div>
                    <p className="provider-detail-note">Read-only demo profile. Verification decisions, account changes, and profile edits require approved admin API endpoints.</p>
                </section>
            )}
        </div>
    );
}
