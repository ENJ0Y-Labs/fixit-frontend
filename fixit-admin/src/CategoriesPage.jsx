import { useMemo, useState } from 'react';
import { demoCategories, formatCategoryStatus } from './data/demoCategories.js';
import './CategoriesPage.css';

const pageSize = 6;

function CategoryStatus({ status }) {
    return <span className={`status-badge ${status === 'ACTIVE' ? 'status-success' : 'status-neutral'}`}>{formatCategoryStatus(status)}</span>;
}

function createSlug(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState(demoCategories);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(demoCategories[0]?.id ?? null);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [formError, setFormError] = useState('');
    const [feedback, setFeedback] = useState('');

    const filteredCategories = useMemo(() => {
        const term = search.trim().toLowerCase();
        return categories.filter((category) => {
            const matchesSearch = !term || [category.id, category.name, category.slug, category.description]
                .some((value) => value.toLowerCase().includes(term));
            return matchesSearch && (status === 'All' || category.status === status);
        });
    }, [categories, search, status]);

    const pageCount = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
    const visibleCategories = filteredCategories.slice((page - 1) * pageSize, page * pageSize);
    const selectedCategory = categories.find((category) => category.id === selectedId) ?? null;
    const activeCount = categories.filter((category) => category.status === 'ACTIVE').length;
    const inactiveCount = categories.length - activeCount;

    function clearFilters() {
        setSearch('');
        setStatus('All');
        setPage(1);
    }

    function openCreate() {
        setEditing('new');
        setForm({ name: '', description: '' });
        setFormError('');
        setFeedback('');
    }

    function openEdit(category) {
        setEditing(category.id);
        setForm({ name: category.name, description: category.description });
        setFormError('');
        setFeedback('');
    }

    function closeForm() {
        setEditing(null);
        setFormError('');
    }

    function saveCategory(event) {
        event.preventDefault();
        const name = form.name.trim();
        const description = form.description.trim();
        if (!name || !description) {
            setFormError('Enter both a category name and description.');
            return;
        }
        const duplicate = categories.some((category) => category.name.toLowerCase() === name.toLowerCase() && category.id !== editing);
        if (duplicate) {
            setFormError('A category with this name already exists.');
            return;
        }
        if (editing === 'new') {
            const created = {
                id: `DEMO-${String(categories.length + 1).padStart(3, '0')}`,
                name,
                slug: createSlug(name),
                description,
                status: 'ACTIVE',
                serviceCount: 0,
                providerCount: 0,
                jobCount: 0,
                updatedAt: 'Just now',
                examples: [],
            };
            setCategories((current) => [created, ...current]);
            setSelectedId(created.id);
            setSearch('');
            setStatus('All');
            setPage(1);
            setFeedback('Demo category created in temporary browser state. It has not been saved to FixIt.');
        } else {
            setCategories((current) => current.map((category) => category.id === editing
                ? { ...category, name, slug: createSlug(name), description, updatedAt: 'Just now' }
                : category));
            setSelectedId(editing);
            setFeedback('Demo category updated in temporary browser state. It has not been saved to FixIt.');
        }
        setEditing(null);
    }

    function toggleStatus(category) {
        const nextStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        setCategories((current) => current.map((item) => item.id === category.id
            ? { ...item, status: nextStatus, updatedAt: 'Just now' }
            : item));
        setFeedback(`Demo category marked ${formatCategoryStatus(nextStatus).toLowerCase()}. This change exists only in browser memory.`);
    }

    return (
        <div className="categories-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Categories demo</strong> All category, provider, service, and job counts are illustrative sample data. Create, edit, and status controls update temporary browser state only.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">Marketplace configuration</p>
                    <h1>Categories</h1>
                    <p className="page-description">Organise the service categories customers use to find the right help.</p>
                </div>
                <button className="btn btn-primary category-create-button" type="button" onClick={openCreate}>＋ Add category</button>
            </section>

            <section className="categories-summary" aria-label="Category summary">
                <article className="metric-card"><p className="metric-label">Total categories</p><strong className="metric-value">{categories.length}</strong><p className="metric-note">Illustrative records</p></article>
                <article className="metric-card"><p className="metric-label">Active</p><strong className="metric-value">{activeCount}</strong><p className="metric-note">Available in sample</p></article>
                <article className="metric-card"><p className="metric-label">Inactive</p><strong className="metric-value">{inactiveCount}</strong><p className="metric-note">Not available in sample</p></article>
                <article className="metric-card"><p className="metric-label">Listed services</p><strong className="metric-value">{categories.reduce((total, item) => total + item.serviceCount, 0)}</strong><p className="metric-note">Sample service types</p></article>
            </section>

            {feedback && <p className="category-feedback" role="status">{feedback}</p>}

            <section className="panel categories-panel" aria-labelledby="categories-list-heading">
                <div className="panel-header">
                    <div><h2 id="categories-list-heading">Service categories</h2><p>Search, inspect, and manage the sample category list.</p></div>
                    <span className="result-count">{filteredCategories.length} categor{filteredCategories.length === 1 ? 'y' : 'ies'}</span>
                </div>
                <div className="categories-filters">
                    <label className="provider-search">
                        <span aria-hidden="true">⌕</span>
                        <input type="search" aria-label="Search categories" placeholder="Search name, category ID, or description" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
                    </label>
                    <label className="filter-control">
                        <span>Category status</span>
                        <select aria-label="Category status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
                            <option value="All">All statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </label>
                    <button className="clear-filters" type="button" onClick={clearFilters}>Clear filters</button>
                </div>
                <div className="categories-table-wrap">
                    <table className="activity-table categories-table">
                        <thead><tr><th scope="col">Category</th><th scope="col">Services</th><th scope="col">Providers</th><th scope="col">Jobs</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                        <tbody>
                            {visibleCategories.map((category) => (
                                <tr key={category.id} className={selectedId === category.id ? 'is-selected' : ''}>
                                    <td><strong>{category.name}</strong><small>{category.id} · /{category.slug}</small></td>
                                    <td>{category.serviceCount}</td>
                                    <td>{category.providerCount}</td>
                                    <td>{category.jobCount}</td>
                                    <td><CategoryStatus status={category.status} /></td>
                                    <td className="date-cell">{category.updatedAt}</td>
                                    <td className="category-row-actions">
                                        <button className="provider-view-button" type="button" onClick={() => setSelectedId(category.id)}>View</button>
                                        <button className="provider-view-button" type="button" onClick={() => openEdit(category)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleCategories.length === 0 && <div className="provider-empty" role="status"><strong>No categories match these filters</strong><p>Try another search term or status.</p><button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button></div>}
                </div>
                <div className="provider-pagination">
                    <span>Showing {filteredCategories.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredCategories.length)} of {filteredCategories.length}</span>
                    <div className="pagination-actions">
                        <button className="pagination-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                        <span aria-live="polite">Page {page} of {pageCount}</span>
                        <button className="pagination-button" type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </div>
            </section>

            {selectedCategory && (
                <section className="panel category-detail" aria-labelledby="category-detail-heading">
                    <div className="panel-header">
                        <div><p className="eyebrow">Category {selectedCategory.id}</p><h2 id="category-detail-heading">{selectedCategory.name}</h2><p>{selectedCategory.description}</p></div>
                        <CategoryStatus status={selectedCategory.status} />
                    </div>
                    <div className="category-detail-grid">
                        <div><span>URL slug</span><strong>/{selectedCategory.slug}</strong></div>
                        <div><span>Service types</span><strong>{selectedCategory.serviceCount}</strong></div>
                        <div><span>Providers</span><strong>{selectedCategory.providerCount}</strong><small>Illustrative count</small></div>
                        <div><span>Jobs</span><strong>{selectedCategory.jobCount}</strong><small>Illustrative count</small></div>
                    </div>
                    <div className="category-examples">
                        <h3>Example services</h3>
                        {selectedCategory.examples.length
                            ? <ul>{selectedCategory.examples.map((example) => <li key={example}>{example}</li>)}</ul>
                            : <p>No example services are attached to this demo category.</p>}
                    </div>
                    <div className="category-detail-actions">
                        <button className="btn btn-secondary" type="button" onClick={() => openEdit(selectedCategory)}>Edit category</button>
                        <button className="btn btn-secondary" type="button" onClick={() => toggleStatus(selectedCategory)}>{selectedCategory.status === 'ACTIVE' ? 'Deactivate (demo)' : 'Activate (demo)'}</button>
                    </div>
                    <p className="category-readonly-note">Demo controls only. No customer discovery, provider listings, service records, or existing jobs are changed on the server.</p>
                </section>
            )}

            {editing && (
                <div className="category-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
                    <section className="category-modal panel" role="dialog" aria-modal="true" aria-labelledby="category-form-heading">
                        <div className="panel-header"><div><p className="eyebrow">Category management · Demo</p><h2 id="category-form-heading">{editing === 'new' ? 'Add category' : 'Edit category'}</h2><p>Changes are temporary and will not be sent to FixIt.</p></div><button className="icon-button" type="button" aria-label="Close category form" onClick={closeForm}>×</button></div>
                        <form onSubmit={saveCategory}>
                            <label className="category-form-field">Category name<input autoFocus value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} maxLength={60} /></label>
                            <label className="category-form-field">Description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} maxLength={240} /></label>
                            {formError && <p className="category-form-error" role="alert">{formError}</p>}
                            <div className="category-form-actions"><button className="btn btn-secondary" type="button" onClick={closeForm}>Cancel</button><button className="btn btn-primary" type="submit">{editing === 'new' ? 'Create demo category' : 'Save demo changes'}</button></div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}
