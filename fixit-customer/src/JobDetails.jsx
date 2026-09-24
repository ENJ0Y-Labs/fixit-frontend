import './styles/pages/jobs.css';
import JobDetailsPageProps from './jobdetails/JobDetailsPageProps';

function JobDetails({ job, onBack, onPayment, onMessages, onCancel }) {
    const handleCancel = () => {
        if (window.confirm('Cancel this job? This will mark the job as cancelled.')) {
            onCancel();
        }
    };

    return (
        <div className="job-details-page page-surface">
            <header className="page-header job-details-header">
                <div>
                    <button type="button" className="back-button" aria-label="Go back" onClick={onBack}><i className="fa-solid fa-arrow-left"></i></button>
                    <h1>Job Details</h1>
                </div>
                <div className="header-actions">
                    <button type="button" className="outline-button" onClick={handleCancel} disabled={job?.status === 'CANCELLED'}>Cancel Job</button>
                    <button type="button" className="dark-button" onClick={onMessages}>Support</button>
                </div>
            </header>
            <main className="job-details-main">
                <JobDetailsPageProps
                    {...job}
                    providerName={job?.provider || job?.providerName}
                    agreedprice={job?.price || job?.priceValue || 0}
                    onPayment={onPayment}
                    onMessages={onMessages}
                />
            </main>
        </div>
    );
}

export default JobDetails;
