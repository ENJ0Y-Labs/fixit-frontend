import './styles/pages/home.css';
import { useMemo, useState } from 'react';
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
    { name: 'Emeka Nwachukwu', job: 'Professional Plumber', category: 'PLUMBING', serviceTitle: 'Fixing Kitchen Sink Leak', location: 'Victoria Island', rating: 4.9, review: 124, distance: 2.4, price: 4500, available: true },
    { name: 'Chioma Adeyemi', job: 'Expert Cleaner', category: 'CLEANING', serviceTitle: 'Deep House Cleaning', location: 'Surulere', rating: 4.8, review: 89, distance: 0.8, price: 3000, available: true },
    { name: 'Tunde Bello', job: 'Master Electrician', category: 'ELECTRICAL', serviceTitle: 'Circuit Breaker Repair', location: 'Ikeja', rating: 5.0, review: 55, distance: 4.1, price: 6000, available: true },
    { name: 'Blessing Okafor', job: 'Interior Painter', category: 'PAINTING', serviceTitle: 'Interior Painting', location: 'Ikoyi', rating: 4.7, review: 42, distance: 1.2, price: 4000, available: false },
    { name: 'Chinedu Obi', job: 'Carpenter', category: 'CARPENTRY', serviceTitle: 'Custom Cabinet Repair', location: 'Yaba', rating: 4.6, review: 31, distance: 3.5, price: 5000, available: true },
    { name: 'Aisha Yusuf', job: 'Home Cleaner', category: 'CLEANING', serviceTitle: 'Move-out Cleaning', location: 'Surulere', rating: 4.5, review: 67, distance: 5.6, price: 3500, available: true },
    { name: 'Samuel Eze', job: 'Electrician', category: 'ELECTRICAL', serviceTitle: 'Socket & Wiring Repair', location: 'Lekki Phase 1', rating: 4.4, review: 24, distance: 7.2, price: 4200, available: true },
    { name: 'Ifeoma Nnaji', job: 'Plumber', category: 'PLUMBING', serviceTitle: 'Bathroom Pipe Repair', location: 'Victoria Island', rating: 4.3, review: 19, distance: 9.5, price: 3800, available: false },
];

function Home({ onSelectProvider }) {
    const PRICE_MIN = 1500;
    const PRICE_MAX = 15000;

    const [minPrice, setMinPrice] = useState(PRICE_MIN);
    const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [rating, setRating] = useState('');
    const [distance, setDistance] = useState('');
    const [availableNow, setAvailableNow] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [visibleCount, setVisibleCount] = useState(4);

    const filteredProviders = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
        const result = providers.filter((provider) => {
            const matchesSearch = !searchValue
                || provider.name.toLowerCase().includes(searchValue)
                || provider.job.toLowerCase().includes(searchValue)
                || provider.serviceTitle.toLowerCase().includes(searchValue)
                || provider.category.toLowerCase().includes(searchValue);
            const matchesLocation = !location || provider.location === location;
            const matchesRating = !rating || provider.rating >= Number(rating);
            const matchesDistance = !distance || provider.distance <= Number(distance);
            const matchesAvailability = !availableNow || provider.available;
            const matchesPrice = provider.price >= minPrice && provider.price <= maxPrice;
            return matchesSearch && matchesLocation && matchesRating && matchesDistance && matchesAvailability && matchesPrice;
        });

        return [...result].sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price') return a.price - b.price;
            return (b.rating * 1000 + b.review) - (a.rating * 1000 + a.review);
        });
    }, [search, location, rating, distance, availableNow, minPrice, maxPrice, sortBy]);

    const resetFilters = () => {
        setMinPrice(PRICE_MIN);
        setMaxPrice(PRICE_MAX);
        setSearch('');
        setLocation('');
        setRating('');
        setDistance('');
        setAvailableNow(false);
        setSortBy('popular');
        setVisibleCount(4);
    };

    return (
        <div className="home page-surface">
            <header className="home-header">
                <div className="search-box">
                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services" aria-label="Search services" />
                </div>
                <div className="location-select">
                    <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                    <select value={location} onChange={(event) => setLocation(event.target.value)} name="location" id="location" aria-label="Select location">
                        <option value="">Select Location</option>
                        {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
                <button type="button" className="icon-button" aria-label="Notifications"><i aria-hidden="true" className="fa-solid fa-bell"></i></button>
                <button type="button" className="icon-button" aria-label="Cart"><i aria-hidden="true" className="fa-solid fa-cart-shopping"></i></button>
            </header>

            <main className="home-main">
                <section className="hero">
                    <div>
                        <p className="eyebrow">FAST, TRUSTED HOME SERVICES</p>
                        <h1>Get your home fixed by trusted local pros.</h1>
                        <p>Verified plumbers, electricians, and more, available in your neighborhood today.</p>
                        <button type="button" className="hero-button" onClick={() => onSelectProvider(providers[0])}>Book a Service Now</button>
                    </div>
                </section>

                <section className="categories-section">
                    <div className="section-heading">
                        <h2>Explore Categories</h2>
                        <button type="button" onClick={() => setSearch('')}>View All Categories</button>
                    </div>
                    <div className="categories-list">
                        {categories.map((category) => (
                            <Category key={category.name} {...category} onSelect={() => setSearch(category.name)} />
                        ))}
                        <button type="button" className="category" onClick={() => setSearch('')}>
                            <span className="category-icon"><i aria-hidden="true" className="fa-solid fa-ellipsis"></i></span>
                            <span className="category-name">More</span>
                        </button>
                    </div>
                </section>

                <section className="services-section">
                    <aside className="service-filters">
                        <div className="filter-heading">
                            <h2>Filters</h2>
                            <button type="button" onClick={resetFilters}>Reset</button>
                        </div>

                        <div className="filter-group">
                            <h3>Price Range (₦)</h3>
                            <div className="price-inputs">
                                <input type="number" min={PRICE_MIN} max={maxPrice - 1} value={minPrice} aria-label="Minimum price" onChange={(event) => setMinPrice(Math.min(Math.max(Number(event.target.value) || PRICE_MIN, PRICE_MIN), maxPrice - 1))} />
                                <input type="number" min={minPrice + 1} max={PRICE_MAX} value={maxPrice} aria-label="Maximum price" onChange={(event) => setMaxPrice(Math.max(Math.min(Number(event.target.value) || PRICE_MAX, PRICE_MAX), minPrice + 1))} />
                            </div>
                            <DoubleRangeSlider min={PRICE_MIN} max={PRICE_MAX} minValue={minPrice} maxValue={maxPrice} onChange={(nextMin, nextMax) => { setMinPrice(nextMin); setMaxPrice(nextMax); }} />
                        </div>

                        <fieldset className="filter-group option-group">
                            <legend>Minimum Rating</legend>
                            <label><input type="radio" name="rating" value="4.5" checked={rating === '4.5'} onChange={(event) => setRating(event.target.value)} /> 4.5 &amp; Above</label>
                            <label><input type="radio" name="rating" value="4" checked={rating === '4'} onChange={(event) => setRating(event.target.value)} /> 4.0 &amp; Above</label>
                            <label><input type="radio" name="rating" value="3.5" checked={rating === '3.5'} onChange={(event) => setRating(event.target.value)} /> 3.5 &amp; Above</label>
                        </fieldset>

                        <fieldset className="filter-group option-group">
                            <legend>Distance</legend>
                            <label><input type="radio" name="distance" value="5" checked={distance === '5'} onChange={(event) => setDistance(event.target.value)} /> Within 5 km</label>
                            <label><input type="radio" name="distance" value="10" checked={distance === '10'} onChange={(event) => setDistance(event.target.value)} /> Within 10 km</label>
                            <label><input type="radio" name="distance" value="20" checked={distance === '20'} onChange={(event) => setDistance(event.target.value)} /> Within 20 km</label>
                        </fieldset>

                        <div className="filter-group availability-filter">
                            <h3>Availability</h3>
                            <div>
                                <span>Available Now</span>
                                <Toggle label="Available now" isOn={availableNow} onChange={setAvailableNow} />
                            </div>
                        </div>
                    </aside>

                    <div className="service-providers">
                        <div className="service-header">
                            <div>
                                <h2>Recommended Service Providers</h2>
                                <p>{filteredProviders.length} provider{filteredProviders.length === 1 ? '' : 's'} found</p>
                            </div>
                            <label>
                                Sort by:
                                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort providers">
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rating</option>
                                    <option value="price">Lowest Rate</option>
                                </select>
                            </label>
                        </div>

                        {filteredProviders.slice(0, visibleCount).map((provider) => (
                            <ServiceProvider key={provider.name} {...provider} onSelect={() => onSelectProvider(provider)} />
                        ))}

                        {filteredProviders.length === 0 && <p className="empty-state">No providers match your current filters.</p>}

                        {visibleCount < filteredProviders.length && (
                            <button type="button" className="load-more-button" onClick={() => setVisibleCount((count) => count + 4)}>Load More Providers</button>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
