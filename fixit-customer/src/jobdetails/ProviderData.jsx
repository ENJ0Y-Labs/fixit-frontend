import avatarPlaceholder from '../assets/avatar-placeholder.svg';

function ProviderData({ name, title, avatarurl, rating, reviewcount, isonline }) {
    const hasRating = rating !== null && rating !== undefined && Number.isFinite(Number(rating)) && Number(reviewcount) > 0;
    return (
        <>
            <div className="provider-heading-row">
                <h2>Assigned Provider</h2>
                {typeof isonline === 'boolean' && <span className={'online-badge ' + (isonline ? 'online' : 'offline')}>{isonline ? 'Online' : 'Offline'}</span>}
            </div>
            <div className="provider-details">
                <img src={avatarurl || avatarPlaceholder} alt={name ? name + ' profile' : 'Provider profile placeholder'} />
                <div>
                    <h3>{name || 'Provider name unavailable'}</h3>
                    {title && <p>{title}</p>}
                    {hasRating && <div className="provider-rating"><i className="fa-solid fa-star" aria-hidden="true"></i><strong>{Number(rating).toFixed(1)}</strong><span>({Number(reviewcount)} reviews)</span></div>}
                </div>
            </div>
            <p className="job-detail-muted">Contact options are available when the platform enables them for this job.</p>
        </>
    );
}

export default ProviderData;
