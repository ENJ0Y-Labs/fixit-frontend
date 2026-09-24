// fixit-customer\src\myjobs\JobCard.jsx

function JobCard({
    icons = "fa-solid fa-question",
    category = "Not Specified",
    status = "COMPLETED",
    title = "Unknown",
    dateStr = "Sun, 1 Jan 2000",
    location = "unknown",
    priceLabel = "",
    priceValue = 0,
    priceSubtext = "",
    providerName = "Unknown",
    providerRating = 3,
    bidNo = 4,
    minBudget = 0,
    maxBudget = 0,
    progressPercentage = 75 // Added to support progress tracking
}) {

    // "IN PROGRESS" -> "in-progress" (used by the CSS for the card and the status badge)
    const statusClass = status.toLowerCase().replace(/\s+/g, "-");

    // Jobs that are still awaiting bids show the budget range instead of one price
    const priceText = status.toUpperCase() === "AWAITING BIDS"
        ? `₦${minBudget.toLocaleString("en-NG")} - ₦${maxBudget.toLocaleString("en-NG")}`
        : `₦${priceValue.toLocaleString("en-NG")}`;

    const renderinteractiveSection = () => {
        switch (status.toUpperCase()) {
            case "IN PROGRESS":
                return (
                    <>
                        <div className="provider-info-side">
                            <div className="provider-profile">
                                <div className="avatar-placeholder">🧑‍🔧</div>
                                <div>
                                    <p className="small-label">PROVIDER</p>
                                    <h6>{providerName}</h6>
                                </div>
                            </div>
                            <div className="progress-container">
                                <div className="progress-labels">
                                    <p className="small-label">PROGRESS</p>
                                    <span className="progress-num">{progressPercentage}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="action-buttons-side">
                            <button className="btn-primary">Details</button>
                            <button className="btn-secondary">Chat</button>
                        </div>
                    </>
                );
            case "AWAITING BIDS":
                return (
                    <>
                        <div className="bids-summary-card">
                            <div className="avatar-group-placeholder">👥</div>
                            <div className="bids-text-block">
                                <h6>{bidNo} Bids Received</h6>
                                <p className="subtext">Providers are waiting</p>
                            </div>
                        </div>
                        <div className="action-buttons-side">
                            <button className="btn-primary">View Bids</button>
                            <button className="btn-secondary">Edit Post</button>
                        </div>
                    </>
                );
            case "COMPLETED":
                return (
                    <>
                        <div className="provider-info-side">
                            <div className="provider-profile">
                                <div className="avatar-placeholder">🧑‍🔧</div>
                                <div>
                                    <p className="small-label">PROVIDER</p>
                                    <h6>{providerName}</h6>
                                </div>
                            </div>
                            <div className="rating-row">
                                <div className="stars">
                                    {Array.from({ length: Math.floor(providerRating || 0) }).map((_, index) => (
                                        <i key={index} className="fa-solid fa-star"></i>
                                    ))}
                                </div>
                                <p className="rating-text">{Number(providerRating || 0).toFixed(1)} Given</p>
                            </div>
                        </div>
                        <div className="action-buttons-side">
                            <button className="btn-outline">Rebook Pro</button>
                            <button className="btn-link">Get Invoice</button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <div className={`job-card ${statusClass}`}>
            <div className="icon-container">
                <i className={icons}></i>
            </div>
            
            <div className="main-details">
                <div className="badge-row">
                    <span className="category">{category}</span>
                    <span className={`status ${statusClass}`}>{status}</span>
                </div>
                <h2>{title}</h2>
                <div className="meta-row">
                    <div className="date">
                        <i className="fa-solid fa-calendar"></i>
                        <p>{dateStr}</p>
                    </div>
                    <div className="location">
                        <i className="fa-solid fa-location-dot"></i>
                        <p>{location}</p>
                    </div>
                </div>
            </div>
            
            <hr className="vertical-divider" />
            
            <div className="price-details">
                <p className="label">{priceLabel}</p>
                <h4 className="price">{priceText}</h4>
                <p className="price-subtext">{priceSubtext}</p>
            </div>
            
            <hr className="vertical-divider" />
            
            {/* The two fragments returned above become the left and right halves of this row */}
            <div className="interactive-wrapper">
                <div>{renderinteractiveSection()}</div>
            </div>
        </div>
    );
}

export default JobCard;
