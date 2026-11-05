import { useMemo, useState } from 'react';

const demoProviders = [
    { id: 'PRV-1042', name: 'Chinedu Okafor', business: 'CO Plumbing Services', category: 'Plumbing', location: 'Rumuola, Port Harcourt', phone: '+234 803 555 0142', email: 'chinedu@example.test', rating: 4.8, jobs: 42, joined: '12 Jun 2026', verification: 'Verified', account: 'Active' },
    { id: 'PRV-1041', name: 'Amaka Eze', business: 'BrightSpark Electricals', category: 'Electrical', location: 'GRA Phase 2, Port Harcourt', phone: '+234 806 555 0141', email: 'amaka@example.test', rating: 4.9, jobs: 36, joined: '10 Jun 2026', verification: 'Verified', account: 'Active' },
    { id: 'PRV-1040', name: 'Ibrahim Musa', business: 'Musa Cooling Works', category: 'AC repair', location: 'Rumuokoro, Port Harcourt', phone: '+234 809 555 0140', email: 'ibrahim@example.test', rating: 4.5, jobs: 19, joined: '08 Jun 2026', verification: 'Pending review', account: 'Active' },
    { id: 'PRV-1039', name: 'Blessing Wali', business: 'NeatSpace Cleaning', category: 'Cleaning', location: 'Trans Amadi, Port Harcourt', phone: '+234 802 555 0139', email: 'blessing@example.test', rating: 4.7, jobs: 28, joined: '04 Jun 2026', verification: 'Verified', account: 'Active' },
    { id: 'PRV-1038', name: 'Emeka Nwosu', business: 'Nwosu Home Repairs', category: 'Carpentry', location: 'Eliozu, Port Harcourt', phone: '+234 805 555 0138', email: 'emeka@example.test', rating: 4.2, jobs: 11, joined: '29 May 2026', verification: 'Pending review', account: 'Active' },
    { id: 'PRV-1037', name: 'Precious George', business: 'PG Painting', category: 'Painting', location: 'Old GRA, Port Harcourt', phone: '+234 807 555 0137', email: 'precious@example.test', rating: 4.6, jobs: 23, joined: '25 May 2026', verification: 'Verified', account: 'Active' },
    { id: 'PRV-1036', name: 'Samuel Briggs', business: 'Briggs Pest Control', category: 'Pest control', location: 'Mile 3, Port Harcourt', phone: '+234 803 555 0136', email: 'samuel@example.test', rating: 4.1, jobs: 8, joined: '21 May 2026', verification: 'Rejected', account: 'Suspended' },
    { id: 'PRV-1035', name: 'Favour Ogbonda', business: 'FreshFlow Plumbing', category: 'Plumbing', location: 'Ada George, Port Harcourt', phone: '+234 810 555 0135', email: 'favour@example.test', rating: 4.9, jobs: 31, joined: '18 May 2026', verification: 'Verified', account: 'Active' },
    { id: 'PRV-1034', name: 'David Tamuno', business: 'DT Electrical Works', category: 'Electrical', location: 'Woji, Port Harcourt', phone: '+234 814 555 0134', email: 'david@example.test', rating: 4.3, jobs: 14, joined: '14 May 2026', verification: 'Pending review', account: 'Active' },
    { id: 'PRV-1033', name: 'Joy Amadi', business: 'Joyful Home Care', category: 'Cleaning', location: 'Rumuibekwe, Port Harcourt', phone: '+234 816 555 0133', email: 'joy@example.test', rating: 4.8, jobs: 27, joined: '11 May 2026', verification: 'Verified', account: 'Active' },
    { id: 'PRV-1032', name: 'Godwin Harry', business: 'Harry Glass & Doors', category: 'Glasswork', location: 'Peter Odili Road, Port Harcourt', phone: '+234 818 555 0132', email: 'godwin@example.test', rating: 4.0, jobs: 6, joined: '06 May 2026', verification: 'Pending review', account: 'Active' },
    { id: 'PRV-1031', name: 'Esther Kalu', business: 'Kalu Laundry Services', category: 'Laundry', location: 'Rumuomasi, Port Harcourt', phone: '+234 813 555 0131', email: 'esther@example.test', rating: 4.4, jobs: 17, joined: '02 May 2026', verification: 'Verified', account: 'Active' },
];

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
