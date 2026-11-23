import PropTypes from 'prop-types';
import avatarPlaceholder from '../assets/avatar-placeholder.svg';

function ServiceProvider({ img = '', name = 'Guest', job = 'Not specified', serviceTitle = '', location = '', available = false, availabilityKnown = false, rating = null, review = null, distance = null, price = null, id, source = 'sample', isAuthenticated = false, onRequireAuth, onSelect }) {
    return (
        <article className="service-card marketplace-provider-card" data-provider-id={id}>
            <div className="service-card-top marketplace-provider-card-top">
                <div className="marketplace-provider-avatar"><img src={img || avatarPlaceholder} alt="" /><span className={available ? 'is-online' : ''} title={availabilityKnown ? (available ? 'Marked available' : 'Not currently available') : 'Availability not provided'}></span></div>
                <div className="service-details">
                    <div className="marketplace-provider-name-row"><h3>{name}</h3>{availabilityKnown && <span className={'marketplace-availability-badge' + (available ? ' is-available' : '')}><span aria-hidden="true"></span>{available ? 'Available' : 'Unavailable'}</span>}</div>
                    <p>{job}</p>{serviceTitle && <p className="marketplace-provider-service">{serviceTitle}</p>}
                    <div className="marketplace-provider-meta">
                        {rating !== null && <span className="service-rating"><i className="fa-solid fa-star" aria-hidden="true"></i> {rating.toFixed(1)}{review !== null && <span> ({review} reviews)</span>}</span>}
                        {location && <span className="service-distance"><i className="fa-solid fa-location-dot" aria-hidden="true"></i> {location}{distance !== null ? ` · ${distance.toFixed(1)} km away` : ''}</span>}
                    </div>
                </div>
            </div>
            <div className="marketplace-provider-card-bottom"><div className="service-price"><span>{price !== null ? 'Indicative hourly rate' : 'Pricing'}</span><strong>{price !== null ? `₦${price.toLocaleString('en-NG')}` : 'Not provided'}</strong>{price !== null && <small>/hr</small>}</div><button type="button" className="dark-button" onClick={onSelect}>View profile <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>
            {source === 'sample' && <span className="marketplace-sample-note">Sample listing · Not live provider data</span>}
        </article>
    );
}
ServiceProvider.propTypes = {
    img: PropTypes.string, name: PropTypes.string, job: PropTypes.string, serviceTitle: PropTypes.string,
    location: PropTypes.string, available: PropTypes.bool, availabilityKnown: PropTypes.bool,
    rating: PropTypes.number, review: PropTypes.number, distance: PropTypes.number, price: PropTypes.number,
    id: PropTypes.string, source: PropTypes.string, isAuthenticated: PropTypes.bool,
    onRequireAuth: PropTypes.func, onSelect: PropTypes.func,
};
export default ServiceProvider;
