import JobCard from './myjobs/JobCard';

function MyJobs({ onPostJob, onViewDetails, onOpenMessages }) {
    return (
        <div className="my-jobs page-surface">
            <header className="page-header my-jobs-header">
                <h1>My Jobs</h1>
                <div className="my-jobs-actions">
                    <div className="compact-search">
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                        <input type="search" name="job-search" id="job-search" placeholder="Search jobs" aria-label="Search jobs" />
                    </div>
                    <button type="button" className="dark-button" onClick={onPostJob}>Post New Job</button>
                </div>
            </header>

            <main className="my-jobs-main">
                <div className="jobs-toolbar">
                    <div className="job-status-tabs">
                        <button type="button" className="active">All Jobs</button>
                        <button type="button">Active</button>
                        <button type="button">Completed</button>
                        <button type="button">Cancelled</button>
                    </div>
                    <label className="job-sort">
                        <i className="fa-solid fa-arrow-down-wide-short" aria-hidden="true"></i>
                        Sort:
                        <select name="job-sort" id="job-sort" defaultValue="recent">
                            <option value="recent">Recent First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price">Highest Price</option>
                        </select>
                    </label>
                </div>

                <div className="jobs-list">
                    <JobCard
                        onDetails={() => onViewDetails({ title: 'Fixing Kitchen Sink Leak', provider: 'Emeka Nwachukwu', category: 'PLUMBING', price: 12500 })}
                        onChat={() => onOpenMessages({ title: 'Fixing Kitchen Sink Leak', provider: 'Emeka Nwachukwu', category: 'PLUMBING', price: 12500 })}
                        icon="fa-solid fa-faucet"
                        category="PLUMBING"
                        status="IN PROGRESS"
                        title="Fixing Kitchen Sink Leak"
                        dateStr="Sat, 21 Feb 2026"
                        location="Victoria Island, Lagos"
                        priceLabel="AGREED PRICE"
                        priceValue={12500}
                        priceSubtext="Escrow Secured"
                        providerName="Emeka Nwachukwu"
                        progressPercentage={75}
                    />
                    <JobCard
                        onDetails={() => onViewDetails({ title: 'Circuit Breaker Tripping Frequently', provider: 'Tunde Bello', category: 'ELECTRICAL', price: 8000 })}
                        onChat={() => onOpenMessages({ title: 'Circuit Breaker Tripping Frequently', provider: 'Tunde Bello', category: 'ELECTRICAL', price: 8000 })}
                        icon="fa-solid fa-bolt"
                        category="ELECTRICAL"
                        status="AWAITING BIDS"
                        title="Circuit Breaker Tripping Frequently"
                        dateStr="Mon, 23 Feb 2026"
                        location="Ikeja, Lagos"
                        priceLabel="EST. BUDGET"
                        minBudget={8000}
                        maxBudget={15000}
                        bidNo={3}
                    />
                    <JobCard
                        onDetails={() => onViewDetails({ title: 'Deep House Cleaning (3BR)', provider: 'Chioma Adeyemi', category: 'CLEANING', price: 25000 })}
                        onChat={() => onOpenMessages({ title: 'Deep House Cleaning (3BR)', provider: 'Chioma Adeyemi', category: 'CLEANING', price: 25000 })}
                        icon="fa-solid fa-broom"
                        category="CLEANING"
                        status="COMPLETED"
                        title="Deep House Cleaning (3BR)"
                        dateStr="Wed, 10 Feb 2026"
                        location="Surulere, Lagos"
                        priceLabel="PAID AMOUNT"
                        priceValue={25000}
                        providerName="Chioma Adeyemi"
                        providerRating={5}
                    />
                </div>
            </main>
        </div>
    );
}

export default MyJobs;
