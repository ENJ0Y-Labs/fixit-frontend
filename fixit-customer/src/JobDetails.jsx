import JobDetailsPageProps from './jobdetails/JobDetailsPageProps';

function JobDetails() {
    return (
        <div className="job-details-page page-surface">
            <header className="page-header job-details-header">
                <div>
                    <button type="button" className="back-button" aria-label="Go back">
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1>Job Details</h1>
                </div>
                <div className="header-actions">
                    <button type="button" className="outline-button">Cancel Job</button>
                    <button type="button" className="dark-button">Support</button>
                </div>
            </header>
            <main className="job-details-main">
                <JobDetailsPageProps />
            </main>
        </div>
    );
}

export default JobDetails;
