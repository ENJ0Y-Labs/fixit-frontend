import PropTypes from 'prop-types';

function JobCard({
    id = '',
    icon = 'fa-solid fa-screwdriver-wrench',
    category = 'NOT SPECIFIED',
    status = 'COMPLETED',
    title = 'Unknown',
    dateStr = 'Date not set',
    location = 'Location not set',
    priceLabel = '',
    priceValue = 0,
    priceSubtext = '',
    providerName = '',
    providerRating = 0,
    bidNo = 0,
    minBudget = 0,
    maxBudget = 0,
    progressPercentage = 0,
    onDetails,
}) {
    const normalized = status.toUpperCase();
    const statusClass = normalized.toLowerCase().replace(/\s+/g, '-');
    const isAwaitingBids = normalized === 'AWAITING BIDS';
    const isInProgress = normalized === 'IN PROGRESS';
    const isCompleted = normalized === 'COMPLETED';
    const priceText = isAwaitingBids
        ? `₦${(minBudget || 0).toLocaleString('en-NG')} - ₦${(maxBudget || minBudget || 0).toLocaleString('en-NG')}`
        : `₦${(priceValue || 0).toLocaleString('en-NG')}`;
    const initials = providerName
        ? providerName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
        : '';

    return (
        <article className={`job-card my-job-card ${statusClass}`}>
            <div className="my-job-card-top">
                <div className="job-badges">
                    <span className={`job-status ${statusClass}`}>
                        <span className="my-job-status-dot" aria-hidden="true"></span>
                        {status}
                    </span>
                    <span className="job-category">{category}</span>
                    {isAwaitingBids && bidNo > 0 && <span className="my-job-urgent-note">{bidNo} {bidNo === 1 ? 'bid' : 'bids'} received</span>}
                </div>
                <div className="my-job-card-reference">
                    <span>{id ? `#${id}` : 'Job reference unavailable'}</span>
                    <span className="my-job-card-date">{dateStr}</span>
                </div>
            </div>

            <div className="my-job-card-body">
                <div className="job-icon my-job-icon" aria-hidden="true"><i className={icon}></i></div>
                <div className="job-main-details my-job-main-details">
                    <h2>{title}</h2>
                    <div className="job-meta">
                        <span><i className="fa-solid fa-location-dot" aria-hidden="true"></i>{location}</span>
                    </div>
                    {providerName && (
                        <div className="my-job-provider">
                            <span className="my-job-provider-avatar" aria-hidden="true">{initials}</span>
                            <span className="my-job-provider-copy"><strong>{providerName}</strong><small>{isCompleted ? 'Service provider' : 'Assigned provider'}</small></span>
                            {providerRating > 0 && <span className="my-job-rating"><i className="fa-solid fa-star" aria-hidden="true"></i>{providerRating.toFixed(1)}</span>}
                        </div>
                    )}
                    {isAwaitingBids && <p className="my-job-bids-copy">{bidNo > 0 ? `${bidNo} provider responses received for this request.` : 'Your request is open and waiting for provider responses.'}</p>}
                </div>

                <div className="job-price my-job-price">
                    <p>{priceLabel || (isAwaitingBids ? 'ESTIMATED BUDGET' : 'JOB AMOUNT')}</p>
                    <strong>{priceText}</strong>
                    {priceSubtext && <span>{priceSubtext}</span>}
                    {isInProgress && <span className="my-job-escrow-note"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i>{priceSubtext || 'Payment status not provided'}</span>}
                    {isCompleted && <span className="my-job-completed-note"><i className="fa-solid fa-circle-check" aria-hidden="true"></i>Completed</span>}
                </div>

                <div className="my-job-progress-panel">
                    {isInProgress ? (
                        <>
                            <div className="my-job-progress-heading"><span>Job progress</span><strong>{Math.min(Math.max(progressPercentage, 0), 100)}%</strong></div>
                            <div className="progress-track" role="progressbar" aria-label="Job progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.min(Math.max(progressPercentage, 0), 100)}>
                                <span style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}></span>
                            </div>
                            <div className="my-job-progress-stages"><span>Booked</span><span>In progress</span><span>Completed</span></div>
                        </>
                    ) : isAwaitingBids ? (
                        <><strong>Review provider bids</strong><p>Compare responses before choosing a provider.</p></>
                    ) : isCompleted ? (
                        <><strong>Service completed</strong><p>View the job summary and provider details.</p></>
                    ) : (
                        <><strong>Request cancelled</strong><p>This job is no longer active.</p></>
                    )}
                </div>
            </div>

            <div className="my-job-card-footer">
                <span className="my-job-location"><i className="fa-solid fa-location-dot" aria-hidden="true"></i>{location}</span>
                <div className="my-job-actions">
                    {isAwaitingBids && <button type="button" className="outline-button" onClick={onDetails}>Review bids ({bidNo})</button>}
                    <button type="button" className="dark-button" onClick={onDetails}>Job Details <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                </div>
            </div>
        </article>
    );
}

JobCard.propTypes = {
    id: PropTypes.string,
    icon: PropTypes.string,
    category: PropTypes.string,
    status: PropTypes.string,
    title: PropTypes.string,
    dateStr: PropTypes.string,
    location: PropTypes.string,
    priceLabel: PropTypes.string,
    priceValue: PropTypes.number,
    priceSubtext: PropTypes.string,
    providerName: PropTypes.string,
    providerRating: PropTypes.number,
    bidNo: PropTypes.number,
    minBudget: PropTypes.number,
    maxBudget: PropTypes.number,
    progressPercentage: PropTypes.number,
    onDetails: PropTypes.func,
};

export default JobCard;
