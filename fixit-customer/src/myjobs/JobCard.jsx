import PropTypes from 'prop-types';

function JobCard({
    icon = 'fa-solid fa-question',
    category = 'NOT SPECIFIED',
    status = 'COMPLETED',
    title = 'Unknown',
    dateStr = 'Sun, 1 Jan 2000',
    location = 'Unknown',
    priceLabel = '',
    priceValue = 0,
    priceSubtext = '',
    providerName = 'Unknown',
    providerRating = 3,
    bidNo = 0,
    minBudget = 0,
    maxBudget = 0,
    progressPercentage = 0,
}) {
    const statusClass = status.toLowerCase().replace(/\s+/g, '-');
    const isAwaitingBids = status.toUpperCase() === 'AWAITING BIDS';
    const priceText = isAwaitingBids
        ? `₦${minBudget.toLocaleString('en-NG')} - ₦${maxBudget.toLocaleString('en-NG')}`
        : `₦${priceValue.toLocaleString('en-NG')}`;

    return (
        <article className={`job-card ${statusClass}`}>
            <div className="job-icon" aria-hidden="true"><i className={icon}></i></div>

            <div className="job-main-details">
                <div className="job-badges">
                    <span className="job-category">{category}</span>
                    <span className={`job-status ${statusClass}`}>{status}</span>
                </div>
                <h2>{title}</h2>
                <div className="job-meta">
                    <span><i className="fa-solid fa-calendar"></i>{dateStr}</span>
                    <span><i className="fa-solid fa-location-dot"></i>{location}</span>
                </div>
            </div>

            <div className="job-price">
                <p>{priceLabel}</p>
                <strong>{priceText}</strong>
                <span>{priceSubtext || (isAwaitingBids ? `${bidNo} bids received` : '')}</span>
            </div>

            <div className="job-card-action-area">
                {status.toUpperCase() === 'IN PROGRESS' && (
                    <>
                        <div className="job-provider-summary">
                            <p>PROVIDER</p>
                            <strong>{providerName}</strong>
                            <div className="progress-label"><span>Progress</span><b>{progressPercentage}%</b></div>
                            <div className="progress-track"><span style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}></span></div>
                        </div>
                        <div className="action-buttons">
                            <button type="button" className="dark-button">Details</button>
                            <button type="button" className="outline-button">Chat</button>
                        </div>
                    </>
                )}

                {isAwaitingBids && (
                    <>
                        <div className="job-provider-summary">
                            <p>BIDS</p>
                            <strong>{bidNo} Bids Received</strong>
                            <span>Providers are waiting</span>
                        </div>
                        <div className="action-buttons">
                            <button type="button" className="dark-button">View Bids</button>
                            <button type="button" className="outline-button">Edit Post</button>
                        </div>
                    </>
                )}

                {status.toUpperCase() === 'COMPLETED' && (
                    <>
                        <div className="job-provider-summary">
                            <p>PROVIDER</p>
                            <strong>{providerName}</strong>
                            <div className="rating-stars" aria-label={`${providerRating} out of 5 stars`}>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <i key={index} className={index < Math.round(providerRating) ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                                ))}
                                <span>{providerRating.toFixed(1)} Given</span>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button type="button" className="outline-button">Rebook Pro</button>
                            <button type="button" className="text-button">Get Invoice</button>
                        </div>
                    </>
                )}
            </div>
        </article>
    );
}

JobCard.propTypes = {
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
};

export default JobCard;
