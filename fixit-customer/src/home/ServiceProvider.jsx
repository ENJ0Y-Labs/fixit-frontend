import { useState } from 'react';
import PropTypes from 'prop-types';
import avatarPlaceholder from '../assets/avatar-placeholder.svg';

function ServiceProvider({
    img = '',
    name = 'Guest',
    job = 'Not specified',
    serviceTitle = '',
    location = '',
    available = false,
    rating = 0,
    review = 0,
    distance = 0,
    price = 0,
    onSelect,
}) {
    const [isSaved, setIsSaved] = useState(false);

    return (
        <article className="service-card marketplace-provider-card">
            <div className="service-card-top marketplace-provider-card-top">
                <img src={img || avatarPlaceholder} alt="" />
                <div className="service-details">
                    <div className="marketplace-provider-name-row">
                        <h3>{name}</h3>
                        <span className={'marketplace-availability-badge' + (available ? ' is-available' : '')}>
                            <span aria-hidden="true"></span>
                            {available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <p>{job}</p>
                    {serviceTitle && <p className="marketplace-provider-service">{serviceTitle}</p>}
                    <div className="service-rating">
                        <i className="fa-solid fa-star" aria-hidden="true"></i>
                        <span>{rating.toFixed(1)} ({review} reviews)</span>
                    </div>
                    <div className="service-distance">
                        <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                        <span>{location ? location + ' · ' : ''}{distance.toFixed(1)} km away</span>
                    </div>
                </div>
                <button
                    type="button"
                    className={'favorite-button marketplace-favorite' + (isSaved ? ' is-saved' : '')}
                    aria-label={isSaved ? 'Remove ' + name + ' from saved providers' : 'Save ' + name}
                    aria-pressed={isSaved}
                    onClick={() => setIsSaved((saved) => !saved)}
                >
                    <i aria-hidden="true" className={isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>
            </div>
            <div className="service-card-bottom marketplace-provider-card-bottom">
                <div className="service-price">
                    <span>Indicative rate</span>
                    <strong>₦{price.toLocaleString('en-NG')}</strong>
                    <small>/hr</small>
                </div>
                <button type="button" className="dark-button" onClick={onSelect}>View details</button>
            </div>
        </article>
    );
}

ServiceProvider.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string,
    job: PropTypes.string,
    serviceTitle: PropTypes.string,
    location: PropTypes.string,
    available: PropTypes.bool,
    rating: PropTypes.number,
    review: PropTypes.number,
    distance: PropTypes.number,
    price: PropTypes.number,
    onSelect: PropTypes.func,
};

export default ServiceProvider;
