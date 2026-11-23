import PropTypes from 'prop-types';

const STATUS_META = {
    'AWAITING BIDS': { label: 'Awaiting bids', icon: 'fa-solid fa-hourglass-half', tone: 'bids' },
    'IN PROGRESS': { label: 'In progress', icon: 'fa-solid fa-arrows-rotate', tone: 'progress' },
    COMPLETED: { label: 'Completed', icon: 'fa-solid fa-circle-check', tone: 'completed' },
    CANCELLED: { label: 'Cancelled', icon: 'fa-solid fa-ban', tone: 'cancelled' },
};

function formatMoney(value) {
    if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) return 'Not provided';
    return `₦${Number(value).toLocaleString('en-NG')}`;
}

function JobCard({ job, onViewDetails }) {
    const status = STATUS_META[job.status] || {
        label: job.status || 'Status unavailable',
        icon: 'fa-solid fa-circle-info',
        tone: 'unknown',
    };
    const isBidding = job.status === 'AWAITING BIDS';
    const isInProgress = job.status === 'IN PROGRESS';
    const isCompleted = job.status === 'COMPLETED';
    const amount = isBidding && (job.minBudget || job.maxBudget)
        ? `${formatMoney(job.minBudget)} – ${formatMoney(job.maxBudget)}`
        : formatMoney(job.priceValue);
    const progress = Number.isFinite(Number(job.progressPercentage))
        ? Math.min(100, Math.max(0, Number(job.progressPercentage)))
        : null;
    const providerName = job.providerName || '';
    const initials = providerName
        ? providerName.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
        : '';

    return (
        <article className={`my-job-card status-${status.tone}`}>
            <div className="my-job-card-top">
                <div className="my-job-card-badges">
                    <span className="my-job-reference">#{job.id || 'REFERENCE UNAVAILABLE'}</span>
                    <span className={`my-job-status is-${status.tone}`}>
                        <i className={status.icon} aria-hidden="true" />{status.label}
                    </span>
                    <span className="my-job-category"><i className={job.icon || 'fa-solid fa-screwdriver-wrench'} aria-hidden="true" />{job.category || 'Other'}</span>
                    {isBidding && job.bidNo !== null && job.bidNo !== undefined && (
                        <span className="my-job-bid-count">{job.bidNo} {job.bidNo === 1 ? 'bid' : 'bids'} received</span>
                    )}
                </div>
                <span className="my-job-card-date"><i className="fa-regular fa-clock" aria-hidden="true" />{job.dateStr || 'Date not set'}</span>
            </div>

            <div className="my-job-card-body">
                <div className="my-job-service-icon" aria-hidden="true"><i className={job.icon || 'fa-solid fa-screwdriver-wrench'} /></div>
                <div className="my-job-main-details">
                    <h3>{job.title || 'Untitled job'}</h3>
                    {job.description && <p className="my-job-description">{job.description}</p>}
                    <div className="my-job-location"><i className="fa-solid fa-location-dot" aria-hidden="true" />{job.location || 'Location not provided'}</div>
                    {providerName && (
                        <div className="my-job-provider">
                            <span className="my-job-provider-avatar" aria-hidden="true">{initials}</span>
                            <span><strong>{providerName}</strong><small>{isCompleted ? 'Service provider' : 'Assigned provider'}</small></span>
                            {job.providerRating !== null && job.providerRating !== undefined && Number.isFinite(Number(job.providerRating)) && (
                                <span className="my-job-rating"><i className="fa-solid fa-star" aria-hidden="true" />{Number(job.providerRating).toFixed(1)}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className="my-job-price">
                    <span>{job.priceLabel || (isBidding ? 'ESTIMATED BUDGET' : isCompleted ? 'RECORDED AMOUNT' : 'JOB AMOUNT')}</span>
                    <strong>{amount}</strong>
                    {job.priceSubtext && <small>{job.priceSubtext}</small>}
                    {isInProgress && <small className="my-job-payment-note"><i className="fa-solid fa-shield-halved" aria-hidden="true" />{job.priceSubtext || 'Payment status not provided'}</small>}
                </div>

                <div className="my-job-progress-panel">
                    {isInProgress && progress !== null ? (
                        <>
                            <div className="my-job-progress-heading"><strong>Job progress</strong><b>{progress}%</b></div>
                            <div className="my-job-progress-track" role="progressbar" aria-label="Job progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                                <span style={{ width: `${progress}%` }} />
                            </div>
                            <div className="my-job-progress-stages"><span>Booked</span><span>In progress</span><span>Completed</span></div>
                        </>
                    ) : (
                        <>
                            <strong>{isBidding ? 'Compare provider responses' : isCompleted ? 'Service completed' : isInProgress ? 'Work in progress' : job.status === 'CANCELLED' ? 'Request cancelled' : 'Job update'}</strong>
                            <p>{isBidding
                                ? job.bidNo > 0 ? `${job.bidNo} provider responses received. Review the details before choosing.` : 'Waiting for providers to respond to this request.'
                                : isCompleted ? 'Open the job summary to review the completed service.'
                                    : isInProgress ? 'A progress update has not been provided yet.'
                                        : job.status === 'CANCELLED' ? 'This request is no longer active.'
                                            : 'Open the job to view its latest details.'}</p>
                        </>
                    )}
                </div>
            </div>

            <footer className="my-job-card-footer">
                <span className="my-job-footer-location"><i className="fa-solid fa-location-dot" aria-hidden="true" />{job.location || 'Location not provided'}</span>
                <div className="my-job-actions">
                    {isBidding && <button type="button" className="my-jobs-secondary-action" onClick={onViewDetails}>Review bids{job.bidNo !== null && job.bidNo !== undefined ? ` (${job.bidNo})` : ''}</button>}
                    <button type="button" className="my-jobs-primary-action" onClick={onViewDetails}>Job Details <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
                </div>
            </footer>
        </article>
    );
}

JobCard.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        category: PropTypes.string,
        icon: PropTypes.string,
        status: PropTypes.string,
        dateStr: PropTypes.string,
        location: PropTypes.string,
        priceLabel: PropTypes.string,
        priceValue: PropTypes.number,
        priceSubtext: PropTypes.string,
        minBudget: PropTypes.number,
        maxBudget: PropTypes.number,
        providerName: PropTypes.string,
        providerRating: PropTypes.number,
        bidNo: PropTypes.number,
        progressPercentage: PropTypes.number,
    }).isRequired,
    onViewDetails: PropTypes.func.isRequired,
};

export default JobCard;
