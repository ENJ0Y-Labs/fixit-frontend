import { useState } from 'react';
import Footer from './Footer';
import Category from './home/Category';
import Toggle from './Toggle';
import ServiceProvider from './home/ServiceProvider';
import DoubleRangeSlider from './DoubleRangeSlider';

const locations = ['Lekki Phase 1', 'Victoria Island', 'Ikoyi', 'Yaba', 'Surulere'];

const categories = [
    { name: 'Plumbing', icon: 'fa-solid fa-wrench' },
    { name: 'Electrical', icon: 'fa-solid fa-bolt' },
    { name: 'Cleaning', icon: 'fa-solid fa-broom' },
    { name: 'Carpentry', icon: 'fa-solid fa-hammer' },
    { name: 'Painting', icon: 'fa-solid fa-paint-roller' },
];

const providers = [
    { name: 'Emeka Nwachukwu', job: 'Professional Plumber', rating: 4.9, review: 124, distance: 2.4, price: 4500 },
    { name: 'Chioma Adeyemi', job: 'Expert Cleaner', rating: 4.8, review: 89, distance: 0.8, price: 3000 },
    { name: 'John Okafor', job: 'Certified Electrician', rating: 4.7, review: 76, distance: 3.2, price: 5000 },
    { name: 'Amina Yusuf', job: 'Professional Painter', rating: 4.6, review: 61, distance: 4.1, price: 3500 },
];

function Home() {
    const PRICE_MIN = 1500;
    const PRICE_MAX = 15000;

    const [minPrice, setMinPrice] = useState(PRICE_MIN);
    const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

    const handleMinPriceChange = (event) => {
        const value = Number(event.target.value);

        if (!Number.isFinite(value)) {
            return;
        }

        const nextMin = Math.min(
            Math.max(value, PRICE_MIN),
            maxPrice - 1
        );

        setMinPrice(nextMin);
    };

    const handleMaxPriceChange = (event) => {
        const value = Number(event.target.value);

        if (!Number.isFinite(value)) {
            return;
        }

        const nextMax = Math.max(
            Math.min(value, PRICE_MAX),
            minPrice + 1
        );

        setMaxPrice(nextMax);
    };

    const handleSliderChange = (nextMin, nextMax) => {
        setMinPrice(nextMin);
        setMaxPrice(nextMax);
    };

    return (
        <div className="home page-surface">
            <header className="home-header">
                <div className="search-box">
                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" name="search" id="search" placeholder="Search services" aria-label="Search services" />
                </div>
                <div className="location-select">
                    <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                    <select name="location" id="location" defaultValue="" aria-label="Select location">
                        <option value="">Select Location</option>
                        {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                    </select>
                </div>
                <button type="button" className="icon-button" aria-label="Notifications">
                    <i className="fa-solid fa-bell"></i>
                </button>
                <button type="button" className="icon-button" aria-label="Cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                </button>
            </header>

            <main className="home-main">
                <section className="hero">
                    <div>
                        <p className="eyebrow">FAST, TRUSTED HOME SERVICES</p>
                        <h1>Get your home fixed by trusted local pros.</h1>
                        <p>Verified plumbers, electricians, and more, available in your neighborhood today.</p>
                        <button type="button" className="hero-button">Book a Service Now</button>
                    </div>
                </section>

                <section className="categories-section">
                    <div className="section-heading">
                        <h2>Explore Categories</h2>
                        <button type="button">View All Categories</button>
                    </div>
                    <div className="categories-list">
                        {categories.map((category) => <Category key={category.name} {...category} />)}
                        <button type="button" className="category">
                            <span className="category-icon"><i className="fa-solid fa-ellipsis"></i></span>
                            <span className="category-name">More</span>
                        </button>
                    </div>
                </section>

                <section className="services-section">
                    <aside className="service-filters">
                        <div className="filter-heading">
                            <h2>Filters</h2>
                            <button type="button">Reset</button>
                        </div>

                        <div className="filter-group">
                            <h3>Price Range (₦)</h3>

                            <div className="price-inputs">
                                <input
                                    type="number"
                                    min={PRICE_MIN}
                                    max={maxPrice === '' ? PRICE_MAX : maxPrice - 1}
                                    value={minPrice}
                                    placeholder="Min"
                                    aria-label="Minimum price"
                                    onChange={handleMinPriceChange}
                                />

                                <input
                                    type="number"
                                    min={minPrice === '' ? PRICE_MIN + 1 : minPrice + 1}
                                    max={PRICE_MAX}
                                    value={maxPrice}
                                    placeholder="Max"
                                    aria-label="Maximum price"
                                    onChange={handleMaxPriceChange}
                                />
                            </div>

                            <DoubleRangeSlider
                                min={PRICE_MIN}
                                max={PRICE_MAX}
                                minValue={minPrice}
                                maxValue={maxPrice}
                                onChange={handleSliderChange}
                            />
                        </div>

                        <fieldset className="filter-group option-group">
                            <legend>Minimum Rating</legend>
                            <label><input type="radio" name="rating" value="4.5" /> 4.5 &amp; Above</label>
                            <label><input type="radio" name="rating" value="4" /> 4.0 &amp; Above</label>
                            <label><input type="radio" name="rating" value="3.5" /> 3.5 &amp; Above</label>
                        </fieldset>

                        <fieldset className="filter-group option-group">
                            <legend>Distance</legend>
                            <label><input type="radio" name="distance" value="5" /> Within 5 km</label>
                            <label><input type="radio" name="distance" value="10" /> Within 10 km</label>
                            <label><input type="radio" name="distance" value="20" /> Within 20 km</label>
                        </fieldset>

                        <div className="filter-group availability-filter">
                            <h3>Availability</h3>
                            <div>
                                <span>Available Now</span>
                                <Toggle label="Available now" />
                            </div>
                        </div>
                    </aside>

                    <div className="service-providers">
                        <div className="service-header">
                            <div>
                                <h2>Recommended Service Providers</h2>
                                <p>Find a trusted professional near you.</p>
                            </div>
                            <label>
                                Sort by:
                                <select name="sort-by" id="sort-by-filter" defaultValue="popular" aria-label="Sort providers">
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rating</option>
                                    <option value="price">Lowest Rate</option>
                                </select>
                            </label>
                        </div>

                        {providers.map((provider) => <ServiceProvider key={provider.name} {...provider} />)}

                        <button type="button" className="load-more-button">Load More Profiles</button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
