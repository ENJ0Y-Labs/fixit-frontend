import { useMemo, useState } from 'react';

import { demoCustomers } from './data/demoCustomers.js';

const pageSize = 5;

function AccountBadge({ status }) {
    return <span className={`status-badge ${status === 'Active' ? 'status-info' : 'status-danger'}`}>{status}</span>;
}

export default function CustomersPage() {
    const [search, setSearch] = useState('');
    const [account, setAccount] = useState('All');
    const [page, setPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const filteredCustomers = useMemo(() => {
        const term = search.trim().toLowerCase();
        return demoCustomers.filter((customer) => {
            const matchesSearch = !term || [
                customer.id, customer.name, customer.email, customer.phone, customer.location,
            ].some((value) => value.toLowerCase().includes(term));
            return matchesSearch && (account === 'All' || customer.account === account);
        });
    }, [search, account]);

    const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
    const visibleCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);
    const firstItem = filteredCustomers.length ? (page - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(page * pageSize, filteredCustomers.length);

    function updateSearch(value) {
        setSearch(value);
        setPage(1);
        setSelectedCustomer(null);
    }

    function updateAccount(value) {
        setAccount(value);
        setPage(1);
        setSelectedCustomer(null);
    }

    function clearFilters() {
        setSearch('');
        setAccount('All');
        setPage(1);
        setSelectedCustomer(null);
    }

    return (
        <div className="customers-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Demo records</strong> Customer profiles and counts below are illustrative only. No live customer data or account actions are connected.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">People management</p>
                    <h1>Customers</h1>
                    <p className="page-description">Review customer accounts, contact details, and marketplace activity.</p>
                </div>
                <span className="date-label">{demoCustomers.length} sample customer profiles</span>
            </section>

            <section className="customer-summary" aria-label="Customer summary">
                <article className="metric-card">
                    <p className="metric-label">Total customers</p>
                    <strong className="metric-value">{demoCustomers.length}</strong>
                    <p className="metric-note">Illustrative records</p>
                </article>
                <article className="metric-card">
                    <p className="metric-label">Active accounts</p>
                    <strong className="metric-value">{demoCustomers.filter((customer) => customer.account === 'Active').length}</strong>
                    <p className="metric-note">Sample account status</p>
                </article>
                <article className="metric-card">
                    <p className="metric-label">Suspended accounts</p>
                    <strong className="metric-value">{demoCustomers.filter((customer) => customer.account === 'Suspended').length}</strong>
                    <p className="metric-note">Sample account status</p>
                </article>
                <article className="metric-card">
                    <p className="metric-label">Jobs posted</p>
                    <strong className="metric-value">{demoCustomers.reduce((total, customer) => total + customer.jobs, 0)}</strong>
                    <p className="metric-note">Across sample profiles</p>
                </article>
            </section>

            <section className="panel customers-panel" aria-labelledby="customer-list-heading">
                <div className="panel-header customers-panel-header">
                    <div>
                        <h2 id="customer-list-heading">All customers</h2>
                        <p>Search and narrow the sample customer directory.</p>
                    </div>
                    <span className="result-count">{filteredCustomers.length} result{filteredCustomers.length === 1 ? '' : 's'}</span>
                </div>

                <div className="customer-filters">
                    <label className="provider-search">
                        <span className="sr-only">Search customers</span>
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            role="searchbox"
                            aria-label="Search customers"
                            value={search}
                            onChange={(event) => updateSearch(event.target.value)}
                            placeholder="Search name, email, ID, phone, or location"
                        />
                    </label>
                    <label className="filter-control">
                        <span>Account status</span>
                        <select aria-label="Customer account status" value={account} onChange={(event) => updateAccount(event.target.value)}>
                            <option>All</option>
                            <option>Active</option>
                            <option>Suspended</option>
                        </select>
                    </label>
                    <button className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button>
                </div>

                <div className="table-wrap customers-table-wrap">
                    <table className="activity-table customers-table">
                        <thead>
                            <tr>
                                <th scope="col">Customer</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Location</th>
                                <th scope="col">Jobs</th>
                                <th scope="col">Account</th>
                                <th scope="col">Joined</th>
                                <th scope="col"><span className="sr-only">Details</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td><strong>{customer.name}</strong><small>{customer.id}</small></td>
                                    <td><span>{customer.email}</span><small>{customer.phone}</small></td>
                                    <td>{customer.location}</td>
                                    <td className="customer-jobs"><strong>{customer.jobs}</strong><small>{customer.completedJobs} completed</small></td>
                                    <td><AccountBadge status={customer.account} /></td>
                                    <td className="date-cell">{customer.joined}</td>
                                    <td><button className="provider-view-button" type="button" onClick={() => setSelectedCustomer(customer)}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleCustomers.length === 0 && (
                        <div className="provider-empty" role="status">
                            <strong>No customers match these filters</strong>
                            <p>Try another search term or clear the selected filters.</p>
                            <button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button>
                        </div>
                    )}
                </div>

                <div className="provider-pagination">
                    <span>Showing {firstItem}–{lastItem} of {filteredCustomers.length}</span>
                    <div className="pagination-actions">
                        <button type="button" className="pagination-button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                        <span aria-live="polite">Page {page} of {pageCount}</span>
                        <button type="button" className="pagination-button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </div>
            </section>

            {selectedCustomer && (
                <section className="panel customer-detail" aria-labelledby="customer-detail-heading">
                    <div className="panel-header">
                        <div>
                            <p className="eyebrow">Customer profile · {selectedCustomer.id}</p>
                            <h2 id="customer-detail-heading">{selectedCustomer.name}</h2>
                            <p>Customer account overview</p>
                        </div>
                        <button className="provider-close-button" type="button" onClick={() => setSelectedCustomer(null)}>Close details</button>
                    </div>
                    <div className="provider-detail-grid">
                        <div><span>Email</span><strong>{selectedCustomer.email}</strong></div>
                        <div><span>Phone</span><strong>{selectedCustomer.phone}</strong></div>
                        <div><span>Location</span><strong>{selectedCustomer.location}</strong></div>
                        <div><span>Joined</span><strong>{selectedCustomer.joined}</strong></div>
                        <div><span>Total jobs posted</span><strong>{selectedCustomer.jobs}</strong></div>
                        <div><span>Completed jobs</span><strong>{selectedCustomer.completedJobs}</strong></div>
                        <div><span>Account status</span><strong><AccountBadge status={selectedCustomer.account} /></strong></div>
                    </div>
                    <p className="provider-detail-note">Read-only demo profile. Account suspension, restoration, profile edits, and customer history require approved admin API endpoints.</p>
                </section>
            )}
        </div>
    );
}
