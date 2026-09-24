// fixit-customer\src\Home.jsx
import Footer from './Footer'
import Category from './home/Category';
import Toggle from './Toggle' 
import ServiceProvider from './home/ServiceProvider'

function Home() {

    const locations = ["Lekki Phase 1", "Victoria Island", "Ikoyi", "Yaba", "Surulere"];
    const categories = [{"name":"Plumbing", "icon":"fa-solid fa-wrench"}, 
                        {"name":"Electrical", "icon":"fa-solid fa-bolt"}, 
                        {"name":"Cleaning", "icon":"fa-solid fa-broom"}, 
                        {"name":"Carpentry", "icon":"fa-solid fa-hammer"}, 
                        {"name":"Painting", "icon":"fa-solid fa-paint-roller"}];
    const providers = [{"name":"Emeka Nwachukwu", "job": "Professional Plumber", "rating": 4.9, "review": 124, "distance": 2.4, "price": 4500},
                        {"name":"Chioma Adeyemi", "job": "Expert Cleaner", "rating": 4.8, "review": 89, "distance": 0.8, "price": 3000},
    ]

    return(
        <div className="home">
            <header>
                <div>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="search" name="search" id="search" aria-label="Search services" />
                </div>
                <div>
                    <i className="fa-solid fa-location-dot"></i>
                    <select name="location" id="location" aria-label="Select location">
                        <option value="">Select Location</option>
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="button" aria-label="Notifications">
                    <i className="fa-solid fa-bell"></i>
                </button>
                <button type="button" aria-label="Cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                </button>
            </header>
            <main>
                <div className="hero">
                    <h2>Get your home fixed by trusted local pros.</h2>
                    <p>Verified plumbers, electricians, and more, available in your neighborhood today.</p>
                    <button>Book a Service Now</button>
                </div>
                <div className="categories-section">
                    <div className="categories-header">
                        <span>Explore Categories</span>
                        <span>View All Categories</span>
                    </div>
                    <div className="categories-list">
                        {
                            categories.map((category) => (
                                <Category key={category.name} name={category.name} icon={category.icon} />
                            ))
                        }
                        <div className="category">
                            <div className="category-icon">
                                <i className="fa-solid fa-ellipsis"></i>
                            </div>
                            <p className="category-name">More</p>
                        </div>
                    </div>
                </div>
                <div className="services-section">
                    <div className="service-filters">
                        <div className="filter-header">
                            <h4>Filters</h4>
                            <p>Reset</p>
                        </div>
                        <div className="price-range">
                            <h6>Price Range (N)</h6>
                            <div>
                                <input type="text" name="price-min" placeholder="Min" aria-label="Minimum price" />
                                <input type="text" name="price-max" placeholder="Max" aria-label="Maximum price" />
                            </div>
                            <input type="range" name="price-range" id="price-range" aria-label="Price range" />
                        </div>
                        <div className="rating-filter">
                            <h6>Minimum Rating</h6>
                            <input type="radio" name="rating" id="rating-450"/>
                            <label htmlFor="rating-450">4.5 & Above</label>
                            <input type="radio" name="rating" id="rating-400"/>
                            <label htmlFor="rating-400">4.0 & Above</label>
                            <input type="radio" name="rating" id="rating-350"/>
                            <label htmlFor="rating-350">3.5 & Above</label>
                        </div>
                        <div className="distance-filter">
                            <h6>Distance</h6>
                            <input type="radio" name="distance" id="distance-5"/>
                            <label htmlFor="distance-5">Within 5 km</label>
                            <input type="radio" name="distance" id="distance-10"/>
                            <label htmlFor="distance-10">Within 10 km</label>
                            <input type="radio" name="distance" id="distance-20"/>
                            <label htmlFor="distance-20">Within 20 km</label>
                        </div>
                        <div className="availability-filter">
                            <h6>Availability</h6>
                            <div className="availability-option">
                                <p>Available Now</p>
                                <Toggle label="Available now" />
                            </div>
                        </div>
                    </div>
                    <div className='service-providers'>
                        <div className='service-header'>
                            <h2>Recommended Service Providers</h2>
                            <div className='sort-filter'>
                                <label htmlFor="sort-by-filter">Sort by: </label>
                                <select name="sort-by" id="sort-by-filter">
                                    <option value="">Most Popular</option>
                                </select>
                            </div>
                        </div>
                        {
                            providers.map((provider) => (
                                <ServiceProvider key={provider.name} name={provider.name} job={provider.job} rating={provider.rating} review={provider.review} distance={provider.distance} price={provider.price}/>
                            ))
                        }
                        <ServiceProvider />
                        <button>
                            Load More Profile
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
