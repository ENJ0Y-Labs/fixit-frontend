// fixit-customer\src\home\ServiceProvider.jsx
import PropTypes from 'prop-types'
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

function ServiceProvider({
    img = "",
    name = "Guest",
    job = "Not specified",
    rate = 0,
    review = 0,
    distance = 0,
    price = 0
}) {

    return(
        <div className="service-card">
            <div className="section-one">
                <img src={img || avatarPlaceholder} alt={`${name} profile picture`} />
                <div className="service-details">
                    <h4>{name}</h4>
                    <p>{job}</p>
                    <div>
                        <div className="service-rating">
                            <i className="fa-solid fa-star"></i>
                            <p>{rate}({review} reviews)</p>
                        </div>
                        <hr />
                        <div className="service-distance">
                            <p>{distance} km away</p>
                        </div>
                    </div>
                </div>
                <button type="button" className="plain-button favorite-button" aria-label="Save provider">
                    <i className="fa-regular fa-heart"></i>
                </button>
            </div>
            <hr />
            <div className="section-two">
                <div className="service-price">
                    <p>Rate</p>
                    <p><span className="price-amount">N{price}</span> /hr</p>
                </div>
                <button className="service-button">
                    View Full Profile
                </button>
            </div>
        </div>
    );
}

ServiceProvider.propTypes = {
    img: PropTypes.string,
    name: PropTypes.string,
    job: PropTypes.string,
    rate: PropTypes.number,
    review: PropTypes.number,
    distance: PropTypes.number,
    price: PropTypes.number
}

export default ServiceProvider;
