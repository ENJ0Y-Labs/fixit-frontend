import { useState } from 'react';
import './styles/pages/jobs.css';
import JobDetailsPageProps from './jobdetails/JobDetailsPageProps';

function JobDetails({ job, loading = false, error = '', cancelError = '', onBack, onPayment, onCancel, onRetry }) {
    const [cancelling, setCancelling] = useState(false);
    const [actionError, setActionError] = useState('');
    const canCancel = job?.canCancel === true;

    const handleCancel = async () => {
        if (!canCancel || cancelling) return;
        if (!window.confirm('Cancel this job? The server will confirm whether the request can be cancelled.')) return;
        setCancelling(true);
        setActionError('');
        try {
            await onCancel();
        } catch (cancelFailure) {
            setActionError(cancelFailure?.message || 'The job could not be cancelled. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="job-details-page page-surface">
            <header className="page-header job-details-header">
                <div>
                    <button type="button" className="back-button" aria-label="Go back" onClick={onBack}><i className="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
                    <h1>Job Details</h1>
                </div>
                {job && <div className="header-actions"><button type="button" className="outline-button" onClick={handleCancel} disabled={!canCancel || cancelling}>{cancelling ? 'Cancelling…' : 'Cancel Job'}</button></div>}
            </header>
            <main className="job-details-main">
                {loading ? (
                    <section className="job-details-state" role="status" aria-live="polite"><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i><h2>Loading job details</h2><p>Retrieving the latest information for this request.</p></section>
                ) : error ? (
                    <section className="job-details-state" role="alert"><i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><h2>Job unavailable</h2><p>{error}</p><div className="job-details-state-actions"><button type="button" className="outline-button" onClick={onBack}>Back to My Jobs</button>{onRetry && <button type="button" className="dark-button" onClick={onRetry}>Try again</button>}</div></section>
                ) : job ? (
                    <div className="job-details-content">
                        {(actionError || cancelError) && <p className="job-action-error" role="alert">{actionError || cancelError}</p>}
                        <JobDetailsPageProps {...job} providerName={job.providerName} agreedprice={job.agreedprice} paymentId={job.paymentId} onPayment={onPayment} />
                    </div>
                ) : (
                    <section className="job-details-state" role="alert"><i className="fa-solid fa-circle-question" aria-hidden="true"></i><h2>No job selected</h2><p>Return to My Jobs and choose a service request to view its details.</p><button type="button" className="dark-button" onClick={onBack}>Back to My Jobs</button></section>
                )}
            </main>
        </div>
    );
}

export default JobDetails;
