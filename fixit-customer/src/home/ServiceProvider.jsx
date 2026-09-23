// fixit-customer\src\home\ServiceProvider.jsx
import PropTypes from 'prop-types'

function ServiceProvider({
    img = "/assets/hero.png",
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
                <img src={img} alt="profile-pic" />
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
                <div>
                    <i className="fa-regular fa-heart"></i>
                </div>
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

ServiceProvider.defaultProps = {
    img: "../assets/hero.png",
    name: "Guest",
    job: "Not specified",
    rate: 0,
    review: 0,
    distance: 0,
    price: 0
}

export default ServiceProvider;