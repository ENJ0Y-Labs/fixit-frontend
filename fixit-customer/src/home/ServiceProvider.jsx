import PropTypes from 'prop-types';
import avatarPlaceholder from '../assets/avatar-placeholder.svg';

function ServiceProvider({
    img = '',
    name = 'Guest',
    job = 'Not specified',
    rating = 0,
    review = 0,
    distance = 0,
    price = 0,
    onSelect,
}) {
    return (
        <article className="service-card">
            <div className="service-card-top">
                <i aria-hidden="true"mg src={img || avatarPlaceholder} alt={`${name} profile`} />
                <div className="service-details">
                    <h3>{name}</h3>
                    <p>{job}</p>
                    <div className="service-rating"><i className="fa-solid fa-star" aria-hidden="true"></i><span>{rating.toFixed(1)} ({review} reviews)</span></div>
                    <div className="service-distance"><i className="fa-solid fa-location-dot" aria-hidden="true"></i><span>{distance.toFixed(1)} km away</span></div>
                </div>
                <button type="button" className="favorite-button" aria-label={`Save ${name}`} onClick={(event) => event.stopPropagation()}>
                    <i aria-hidden="true" className="fa-regular fa-heart"></i>
                </button>
            </div>
            <div className="service-card-bottom">
                <div className="service-price"><span>Rate</span><strong>₦{price.toLocaleString('en-NG')}</strong><small>/hr</small></div>
                <button type="button" className="dark-button" onClick={onSelect}>View Full Profile</button>
            </div>
        </article>
    );
}

ServiceProvider.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string,
    job: PropTypes.string,
    rating: PropTypes.number,
    review: PropTypes.number,
    distance: PropTypes.number,
    price: PropTypes.number,
    onSelect: PropTypes.func,
};

export default ServiceProvider;
