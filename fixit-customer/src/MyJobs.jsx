// fixit-customer\src\MyJobs.jsx
import JobCard from './myjobs/JobCard'

function MyJobs() {

    return (
        <div className="my-jobs">
            <header>
                <div>
                    <h2>My jobs</h2>
                </div>
                <div>
                    <div>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" name="" id="" />
                    </div>
                    <button>Post New Job</button>
                </div>
            </header>
            <main>
                <div className="label">
                    <div className="job-status">
                        <div>
                            <p>All Jobs</p>
                        </div>
                        <div>
                            <p>Active</p>
                        </div>
                        <div>
                            <p>Completed</p>
                        </div>
                        <div>
                            <p>Cancelled</p>
                        </div>
                    </div>
                    <div className="job-sort">
                        <i className="fa-solid fa-arrow-down-wide-short"></i>
                        <p>Sort:</p>
                        <select name="job-sort" id="">
                            <option value="">Recent First</option>
                        </select>
                    </div>
                </div>
                <div className="jobs-list">
                    <JobCard
                        icons="fa-solid fa-faucet"
                        category="PLUMBING"
                        status="IN PROGRESS"
                        title="Fixing Kitchen Sink Leak"
                        dateStr="Sat, 21 Feb 2026"
                        location="Victoria Island, Lagos"
                        priceLabel="AGREED PRICE"
                        priceValue= {12500}
                        priceSubtext="Escrow Secured"
                        providerName="Emeka Nwachukwu"
                        progressPercentage={75}
                    />
                    <JobCard
                        icons="fa-solid fa-bolt"
                        category="ELECTRICAL"
                        status="AWAITING BIDS"
                        title="Circuit Breaker Tripping Frequently"
                        dateStr="Mon, 23 Feb 2026"
                        location="Ikeja, Lagos"
                        priceLabel="EST. BUDGET"
                        minBudget={8000}
                        maxBudget={15000}
                        bidNo={3}
                        priceSubtext="3 Bids Received"
                    />
                    <JobCard
                        icons="fa-solid fa-broom"
                        category='CLEANING'
                        status='COMPLETED'
                        title="Deep House Cleaning (3BR)"
                        dateStr="Wed, 10 Feb 2026"
                        location="Surulere, Lagos"
                        priceLabel="PAID AMOUNT"
                        priceValue= {25000}
                        providerName="Chioma Adeyemi"
                        providerRating={5}
                    />
                </div>
            </main>
        </div>
    );
}

export default MyJobs;