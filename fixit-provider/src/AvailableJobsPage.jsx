import { useMemo, useState } from 'react';
import './AvailableJobsPage.css';
import BidWorkflow from './BidWorkflow.jsx';

const demoJobs = [
    { id: 'job-201', title: 'Repair leaking kitchen sink', category: 'Plumbing', description: 'The kitchen sink pipe is leaking beneath the cabinet. Please inspect the joint, replace worn parts if needed, and test for leaks before leaving.', location: 'Rumuola, Port Harcourt', budget: 18000, urgency: 'Within 2 days', postedAt: 'Today', duration: '1–2 hours', bids: 2, status: 'OPEN', stale: false },
    { id: 'job-202', title: 'Install ceiling fans in two rooms', category: 'Electrical', description: 'Install two ceiling fans in a residential flat. Existing wiring is available; confirm the wiring is safe before installation.', location: 'GRA Phase 2, Port Harcourt', budget: 35000, urgency: 'This week', postedAt: 'Yesterday', duration: '2–3 hours', bids: 4, status: 'OPEN', stale: false },
    { id: 'job-203', title: 'Service split air conditioner', category: 'AC Repair', description: 'Clean filters and coils, inspect drainage, and diagnose why the unit is cooling slowly. Please explain any additional parts before replacing them.', location: 'Peter Odili Road, Port Harcourt', budget: 28000, urgency: 'Within 3 days', postedAt: 'Today', duration: '1–2 hours', bids: 1, status: 'OPEN', stale: false },
    { id: 'job-204', title: 'Paint a medium-sized bedroom', category: 'Painting', description: 'Prepare and repaint one bedroom. The customer can provide paint after the required quantity and finish are agreed.', location: 'Rumuokoro, Port Harcourt', budget: 65000, urgency: 'Flexible', postedAt: '2 days ago', duration: '1 day', bids: 3, status: 'OPEN', stale: false },
    { id: 'job-205', title: 'Fix a bedroom door lock', category: 'Carpentry', description: 'The door lock is sticking and sometimes fails to latch. Inspect the lock and door alignment, then repair or recommend a suitable replacement.', location: 'Mile 3, Port Harcourt', budget: 12000, urgency: 'Within 2 days', postedAt: 'Today', duration: '1 hour', bids: 0, status: 'OPEN', stale: false },
    { id: 'job-206', title: 'Deep clean a two-bedroom flat', category: 'Cleaning', description: 'Deep clean floors, kitchen surfaces, bathrooms, and windows. Cleaning supplies should be discussed before the appointment.', location: 'Old GRA, Port Harcourt', budget: 40000, urgency: 'This week', postedAt: 'Yesterday', duration: '4–5 hours', bids: 5, status: 'OPEN', stale: false },
    { id: 'job-207', title: 'Replace damaged bathroom tiles', category: 'Tiling', description: 'Replace a small section of damaged bathroom wall tiles and check for obvious signs of moisture underneath.', location: 'Elelenwo, Port Harcourt', budget: 50000, urgency: 'Flexible', postedAt: '3 days ago', duration: 'Half day', bids: 2, status: 'OPEN', stale: false },
    { id: 'job-208', title: 'Inspect a faulty water pump', category: 'Plumbing', description: 'The water pump starts intermittently. Diagnose the likely fault and provide a quote before carrying out any replacement work.', location: 'Rukpokwu, Port Harcourt', budget: 22000, urgency: 'Within 3 days', postedAt: 'Today', duration: '1–2 hours', bids: 1, status: 'OPEN', stale: true },
];

const categories = ['All categories', ...new Set(demoJobs.map((job) => job.category))];
const formatNaira = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN', maximumFractionDigits: 0,
}).format(amount);

function LoadingState() {
    return <section className="card jobs-state" aria-busy="true" aria-live="polite"><h2>Loading available jobs</h2><p className="text-muted">Fetching current opportunities…</p><div className="jobs-skeleton" aria-hidden="true"><span /><span /><span /></div></section>;
}

function ErrorState({ onRetry }) {
    return <section className="card jobs-state" role="alert"><h2>We couldn’t load available jobs</h2><p className="text-muted">Your search has not been changed. Check your connection and retry.</p><button className="btn btn-primary" type="button" onClick={onRetry}>Try again</button></section>;
}

function JobDetail({ job, onBack, onSubmitBid, submittedBids = [] }) {
    return (
        <section className="job-detail-page">
            <button className="btn btn-quiet job-back" type="button" onClick={onBack}><span aria-hidden="true">←</span> Back to available jobs</button>
            <div className="job-detail-layout">
                <div className="job-detail-main">
                    <div className="card">
                        <div className="job-detail-top"><span className="status-badge status-success">Open opportunity</span><span className="job-posted">Posted {job.postedAt.toLowerCase()}</span>{job.stale && <span className="status-badge status-warning">May be outdated</span>}</div>
                        <p className="eyebrow">{job.category}</p>
                        <h1>{job.title}</h1>
                        <p className="job-detail-location"><span aria-hidden="true">⌖</span> {job.location}</p>
                        <div className="job-detail-facts"><span><strong>Expected budget</strong>{formatNaira(job.budget)}</span><span><strong>Estimated duration</strong>{job.duration}</span><span><strong>Urgency</strong>{job.urgency}</span></div>
                        <hr className="job-divider" />
                        <h2>Job description</h2>
                        <p className="job-description">{job.description}</p>
                    </div>
                    <div className="card customer-privacy-note">
                        <h2>Customer details are protected</h2>
                        <p>Only the general service area is shown before a job is awarded. Customer name, phone number, and exact street address are not available at this stage.</p>
                    </div>
                </div>
                <aside className="card job-detail-aside" aria-label="Job response information">
                    <p className="eyebrow">Before you respond</p>
                    <h2>{formatNaira(job.budget)}</h2>
                    <p className="text-muted">Customer’s indicative budget. Your final quote should reflect the actual scope and agreed materials.</p>
                    <div className="detail-aside-row"><span>Current responses</span><strong>{job.bids}</strong></div>
                    <div className="detail-aside-row"><span>Job reference</span><strong>{job.id.toUpperCase()}</strong></div>
                    <p className="field-hint">Your quote remains a proposal until the customer accepts it.</p>
                </aside>
            </div>
            <BidWorkflow job={job} onSubmitBid={onSubmitBid} submittedBids={submittedBids.filter((bid) => bid.jobId === job.id)} />
        </section>
    );
}

export function AvailableJobsPage({ dataState = 'populated', onRetry = () => {}, jobs = demoJobs, pageSize = 4, onSubmitBid, submittedBids = [] }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All categories');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('any');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const filteredJobs = useMemo(() => {
        const term = search.trim().toLowerCase();
        return jobs.filter((job) => {
            if (job.status !== 'OPEN') return false;
            if (term && ![job.title, job.category, job.description, job.location].some((value) => value.toLowerCase().includes(term))) return false;
            if (category !== 'All categories' && job.category !== category) return false;
            if (location.trim() && !job.location.toLowerCase().includes(location.trim().toLowerCase())) return false;
            if (budget === 'under-20000' && job.budget >= 20000) return false;
            if (budget === '20000-40000' && (job.budget < 20000 || job.budget > 40000)) return false;
            if (budget === 'over-40000' && job.budget <= 40000) return false;
            return true;
        }).sort((a, b) => {
            if (sort === 'budget-low') return a.budget - b.budget;
            if (sort === 'budget-high') return b.budget - a.budget;
            const ageInDays = (postedAt) => postedAt === 'Today' ? 0 : postedAt === 'Yesterday' ? 1 : Number.parseInt(postedAt, 10) || 0;
            return ageInDays(a.postedAt) - ageInDays(b.postedAt);
        });
    }, [jobs, search, category, location, budget, sort]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageJobs = filteredJobs.slice((safePage - 1) * pageSize, safePage * pageSize);
    const selectedJob = selectedJobId ? jobs.find((job) => job.id === selectedJobId && job.status === 'OPEN') : null;

    function resetFilters() {
        setSearch('');
        setCategory('All categories');
        setLocation('');
        setBudget('any');
        setSort('newest');
        setPage(1);
    }

    if (dataState === 'loading') return <LoadingState />;
    if (dataState === 'error') return <ErrorState onRetry={onRetry} />;
    if (selectedJob) return <JobDetail job={selectedJob} onBack={() => setSelectedJobId(null)} onSubmitBid={onSubmitBid} submittedBids={submittedBids} />;

    return (
        <div className="available-jobs-page">
            <div className="demo-notice" role="note"><strong>Demo opportunities</strong><span>These sample job records are illustrative, not live customer requests. Customer contact details are intentionally hidden.</span></div>
            <div className="page-heading">
                <div><p className="eyebrow">Find your next job</p><h1>Available Jobs</h1><p>Discover open requests that match the services you provide.</p></div>
                <span className="jobs-result-count" aria-live="polite">{filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}</span>
            </div>
            {dataState === 'stale' && <div className="jobs-stale-notice" role="status"><strong>Some records may be out of date.</strong> Refresh from the platform before responding. Demo records cannot be refreshed yet.</div>}
            <section className="card jobs-filters" aria-label="Search and filter jobs">
                <div className="jobs-search form-field"><label htmlFor="jobs-search">Search jobs</label><input id="jobs-search" type="search" value={search} placeholder="Try “plumbing” or “Rumuola”" onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></div>
                <div className="form-field"><label htmlFor="jobs-category">Category</label><select id="jobs-category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
                <div className="form-field"><label htmlFor="jobs-location">Area</label><input id="jobs-location" value={location} placeholder="e.g. GRA" onChange={(event) => { setLocation(event.target.value); setPage(1); }} /></div>
                <div className="form-field"><label htmlFor="jobs-budget">Budget</label><select id="jobs-budget" value={budget} onChange={(event) => { setBudget(event.target.value); setPage(1); }}><option value="any">Any budget</option><option value="under-20000">Under ₦20,000</option><option value="20000-40000">₦20,000–₦40,000</option><option value="over-40000">Over ₦40,000</option></select></div>
                <div className="form-field"><label htmlFor="jobs-sort">Sort by</label><select id="jobs-sort" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="newest">Most recent</option><option value="budget-low">Budget: low to high</option><option value="budget-high">Budget: high to low</option></select></div>
                <button className="btn btn-secondary jobs-reset" type="button" onClick={resetFilters}>Clear filters</button>
            </section>
            {filteredJobs.length === 0 ? (
                <section className="card jobs-empty" aria-live="polite"><span className="jobs-empty-icon" aria-hidden="true">⌕</span><h2>No matching jobs</h2><p>Try a different search, choose another category, or clear some filters.</p><button className="btn btn-secondary" type="button" onClick={resetFilters}>Clear all filters</button></section>
            ) : (
                <>
                    <div className="available-job-list" aria-label="Job opportunities">
                        {pageJobs.map((job) => (
                            <article className="card available-job-card" key={job.id}>
                                <div className="available-job-card-main"><div className="available-job-title-row"><span className="job-category-tag">{job.category}</span><span className="job-posted">Posted {job.postedAt.toLowerCase()}</span>{job.stale && <span className="status-badge status-warning">May be outdated</span>}</div><h2>{job.title}</h2><p className="available-job-location"><span aria-hidden="true">⌖</span> {job.location}</p><p className="available-job-summary">{job.description}</p><div className="available-job-meta"><span>{job.urgency}</span><span>{job.duration}</span><span>{job.bids} {job.bids === 1 ? 'response' : 'responses'}</span></div></div>
                                <div className="available-job-card-side"><span className="budget-label">Indicative budget</span><strong>{formatNaira(job.budget)}</strong><button className="btn btn-primary" type="button" onClick={() => setSelectedJobId(job.id)}>View details <span aria-hidden="true">↗</span></button></div>
                            </article>
                        ))}
                    </div>
                    {totalPages > 1 && <nav className="jobs-pagination" aria-label="Job results pages"><button className="btn btn-secondary" type="button" disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button><span>Page {safePage} of {totalPages}</span><button className="btn btn-secondary" type="button" disabled={safePage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button></nav>}
                </>
            )}
        </div>
    );
}

export default AvailableJobsPage;
