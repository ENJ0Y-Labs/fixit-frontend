import './styles/pages/home.css';
import './styles/pages/home-marketplace.css';
import { useMemo, useState } from 'react';
import Footer from './Footer';
import Category from './home/Category';
import ServiceProvider from './home/ServiceProvider';
import DoubleRangeSlider from './DoubleRangeSlider';

const locations = ['Lekki Phase 1', 'Victoria Island', 'Ikoyi', 'Yaba', 'Surulere'];

const categories = [
    { name: 'Plumbing', icon: 'fa-solid fa-faucet' },
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

const quickFilters = [
    { id: 'all', label: 'All providers' },
    { id: 'rating', label: '4.8+ rating', icon: 'fa-solid fa-star' },
    { id: 'price', label: 'Under ₦5,000/hr', icon: 'fa-solid fa-naira-sign' },
    { id: 'available', label: 'Available now', icon: 'fa-solid fa-bolt' },
    { id: 'nearby', label: 'Within 3 km', icon: 'fa-solid fa-location-crosshairs' },
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
    const [quickFilter, setQuickFilter] = useState('all');

    const filteredProviders = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
        const result = providers.filter((provider) => {
            const matchesSearch = !searchValue
                || provider.name.toLowerCase().includes(searchValue)
                || provider.job.toLowerCase().includes(searchValue)
                || provider.serviceTitle.toLowerCase().includes(searchValue)
                || provider.category.toLowerCase().includes(searchValue);
            const matchesLocation = !location || provider.location === location;
            const matchesRating = (!rating || provider.rating >= Number(rating))
                && (quickFilter !== 'rating' || provider.rating >= 4.8);
            const matchesDistance = (!distance || provider.distance <= Number(distance))
                && (quickFilter !== 'nearby' || provider.distance <= 3);
            const matchesAvailability = (!availableNow || provider.available)
                && (quickFilter !== 'available' || provider.available);
            const matchesPrice = provider.price >= minPrice
                && provider.price <= maxPrice
                && (quickFilter !== 'price' || provider.price < 5000);
            return matchesSearch && matchesLocation && matchesRating && matchesDistance && matchesAvailability && matchesPrice;
        });

        return [...result].sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'price') return a.price - b.price;
            return (b.rating * 1000 + b.review) - (a.rating * 1000 + a.review);
        });
    }, [search, location, rating, distance, availableNow, minPrice, maxPrice, sortBy, quickFilter]);

    const resetFilters = () => {
        setMinPrice(PRICE_MIN);
        setMaxPrice(PRICE_MAX);
        setSearch('');
        setLocation('');
        setRating('');
        setDistance('');
        setAvailableNow(false);
        setSortBy('popular');
        setQuickFilter('all');
        setVisibleCount(4);
    };

    const selectQuickFilter = (filter) => {
        setQuickFilter(filter);
        setVisibleCount(4);
    };

    return (
        <div className="home page-surface home-marketplace">
            <header className="home-header marketplace-header">
                <div className="marketplace-location">
                    <span className="marketplace-location-label">Your location</span>
                    <label className="marketplace-location-control">
                        <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                        <select value={location} onChange={(event) => setLocation(event.target.value)} name="location" id="location" aria-label="Select service location">
                            <option value="">Choose your area</option>
                            {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </label>
                </div>
                <label className="search-box marketplace-search">
                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(4); }} placeholder="Find a plumber, electrician, cleaner..." aria-label="Search services and providers" />
                </label>
            </header>

            <main className="home-main marketplace-main">
                <section className="marketplace-hero" aria-labelledby="marketplace-hero-title">
                    <div className="marketplace-hero-art" aria-hidden="true"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                    <div className="marketplace-hero-copy">
                        <span className="marketplace-eyebrow"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i> HOME SERVICES, MADE SIMPLE</span>
                        <h1 id="marketplace-hero-title">Find trusted help for every corner of your home.</h1>
                        <p>Discover local service providers, compare their rates, and choose the right person for the job.</p>
                        <button type="button" className="marketplace-hero-button" onClick={() => onSelectProvider(providers[0])}>
                            Explore providers <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>
                </section>

                <section className="marketplace-categories" aria-labelledby="categories-title">
                    <div className="marketplace-section-heading">
                        <div>
                            <h2 id="categories-title">Popular services</h2>
                            <p>What do you need help with?</p>
                        </div>
                        <button type="button" className="marketplace-text-button" onClick={() => { setSearch(''); setQuickFilter('all'); }}>Clear category</button>
                    </div>
                    <div className="marketplace-category-list">
                        {categories.map((category) => (
                            <Category key={category.name} {...category} onSelect={() => { setSearch(category.name); setVisibleCount(4); }} />
                        ))}
                    </div>
                </section>

                <section className="marketplace-discovery" aria-label="Find service providers">
                    <div className="marketplace-quick-filters" aria-label="Quick provider filters">
                        {quickFilters.map((filter) => (
                            <button
                                type="button"
                                key={filter.id}
                                className={`marketplace-filter-chip${quickFilter === filter.id ? ' is-active' : ''}`}
                                aria-pressed={quickFilter === filter.id}
                                onClick={() => selectQuickFilter(filter.id)}
                            >
                                {filter.icon && <i className={filter.icon} aria-hidden="true"></i>}
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="marketplace-results-layout">
                        <aside className="service-filters marketplace-filter-panel" aria-label="Detailed filters">
                            <div className="filter-heading">
                                <h2>Refine results</h2>
                                <button type="button" onClick={resetFilters}>Reset</button>
                            </div>

                            <div className="filter-group">
                                <h3>Price range (₦/hour)</h3>
                                <div className="price-inputs">
                                    <input type="number" min={PRICE_MIN} max={maxPrice - 1} value={minPrice} aria-label="Minimum hourly price" onChange={(event) => setMinPrice(Math.min(Math.max(Number(event.target.value) || PRICE_MIN, PRICE_MIN), maxPrice - 1))} />
                                    <input type="number" min={minPrice + 1} max={PRICE_MAX} value={maxPrice} aria-label="Maximum hourly price" onChange={(event) => setMaxPrice(Math.max(Math.min(Number(event.target.value) || PRICE_MAX, PRICE_MAX), minPrice + 1))} />
                                </div>
                                <DoubleRangeSlider min={PRICE_MIN} max={PRICE_MAX} minValue={minPrice} maxValue={maxPrice} onChange={(nextMin, nextMax) => { setMinPrice(nextMin); setMaxPrice(nextMax); }} />
                            </div>

                            <fieldset className="filter-group option-group">
                                <legend>Minimum rating</legend>
                                <label><input type="radio" name="rating" value="4.5" checked={rating === '4.5'} onChange={(event) => setRating(event.target.value)} /> 4.5 &amp; above</label>
                                <label><input type="radio" name="rating" value="4" checked={rating === '4'} onChange={(event) => setRating(event.target.value)} /> 4.0 &amp; above</label>
                                <label><input type="radio" name="rating" value="3.5" checked={rating === '3.5'} onChange={(event) => setRating(event.target.value)} /> 3.5 &amp; above</label>
                            </fieldset>

                            <fieldset className="filter-group option-group">
                                <legend>Distance</legend>
                                <label><input type="radio" name="distance" value="5" checked={distance === '5'} onChange={(event) => setDistance(event.target.value)} /> Within 5 km</label>
                                <label><input type="radio" name="distance" value="10" checked={distance === '10'} onChange={(event) => setDistance(event.target.value)} /> Within 10 km</label>
                                <label><input type="radio" name="distance" value="20" checked={distance === '20'} onChange={(event) => setDistance(event.target.value)} /> Within 20 km</label>
                            </fieldset>

                            <label className="marketplace-availability">
                                <span>
                                    <strong>Available now</strong>
                                    <small>Only show providers currently marked available</small>
                                </span>
                                <input type="checkbox" checked={availableNow} onChange={(event) => setAvailableNow(event.target.checked)} />
                            </label>
                        </aside>

                        <div className="marketplace-provider-results">
                            <div className="marketplace-results-heading">
                                <div>
                                    <h2>Service providers near you</h2>
                                    <p>{filteredProviders.length} matching sample listing{filteredProviders.length === 1 ? '' : 's'}</p>
                                </div>
                                <label className="marketplace-sort">
                                    <span>Sort by</span>
                                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort providers">
                                        <option value="popular">Recommended</option>
                                        <option value="rating">Highest rated</option>
                                        <option value="price">Lowest rate</option>
                                    </select>
                                </label>
                            </div>

                            <div className="marketplace-provider-grid">
                                {filteredProviders.slice(0, visibleCount).map((provider) => (
                                    <ServiceProvider key={provider.name} {...provider} onSelect={() => onSelectProvider(provider)} />
                                ))}
                            </div>

                            {filteredProviders.length === 0 && (
                                <div className="empty-state marketplace-empty-state">
                                    <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                                    <strong>No providers found</strong>
                                    <span>Try changing your search or relaxing one of the filters.</span>
                                    <button type="button" className="outline-button" onClick={resetFilters}>Clear all filters</button>
                                </div>
                            )}

                            {visibleCount < filteredProviders.length && (
                                <button type="button" className="load-more-button marketplace-load-more" onClick={() => setVisibleCount((count) => count + 4)}>
                                    Load more providers <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <section className="marketplace-protection" aria-labelledby="protection-title">
                    <div className="marketplace-protection-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i></div>
                    <div>
                        <h2 id="protection-title">Choose with confidence</h2>
                        <p>Review provider profiles, ratings, service details, and pricing before deciding who to contact.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
