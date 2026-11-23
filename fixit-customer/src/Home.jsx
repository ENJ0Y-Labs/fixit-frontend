import './styles/pages/home.css';
import './styles/pages/home-marketplace.css';
import { useEffect, useMemo, useState } from 'react';
import Footer from './Footer';
import PublicHeader from './PublicHeader';
import Category from './home/Category';
import ServiceProvider from './home/ServiceProvider';
import DoubleRangeSlider from './DoubleRangeSlider';

const PRICE_MIN = 1500;
const PRICE_MAX = 15000;

const locations = ['Lekki Phase 1', 'Victoria Island', 'Ikoyi', 'Yaba', 'Surulere', 'Ikeja'];

const categories = [
    { name: 'Plumbing', icon: 'fa-solid fa-faucet' },
    { name: 'Electrical', icon: 'fa-solid fa-bolt' },
    { name: 'Cleaning', icon: 'fa-solid fa-broom' },
    { name: 'Carpentry', icon: 'fa-solid fa-hammer' },
    { name: 'Painting', icon: 'fa-solid fa-paint-roller' },
];

export const providers = [
    { id: 'emeka-nwachukwu', name: 'Emeka Nwachukwu', job: 'Professional Plumber', category: 'PLUMBING', serviceTitle: 'Kitchen and bathroom plumbing', location: 'Victoria Island', rating: 4.9, review: 124, distance: 2.4, price: 4500, available: true },
    { id: 'chioma-adeyemi', name: 'Chioma Adeyemi', job: 'Professional Cleaner', category: 'CLEANING', serviceTitle: 'Home and deep cleaning', location: 'Surulere', rating: 4.8, review: 89, distance: 0.8, price: 3000, available: true },
    { id: 'tunde-bello', name: 'Tunde Bello', job: 'Master Electrician', category: 'ELECTRICAL', serviceTitle: 'Electrical repairs and installations', location: 'Ikeja', rating: 5.0, review: 55, distance: 4.1, price: 6000, available: true },
    { id: 'blessing-okafor', name: 'Blessing Okafor', job: 'Interior Painter', category: 'PAINTING', serviceTitle: 'Interior painting and finishing', location: 'Ikoyi', rating: 4.7, review: 42, distance: 1.2, price: 4000, available: false },
    { id: 'chinedu-obi', name: 'Chinedu Obi', job: 'Carpenter', category: 'CARPENTRY', serviceTitle: 'Furniture and cabinet repairs', location: 'Yaba', rating: 4.6, review: 31, distance: 3.5, price: 5000, available: true },
    { id: 'aisha-yusuf', name: 'Aisha Yusuf', job: 'Home Cleaner', category: 'CLEANING', serviceTitle: 'Move-in and move-out cleaning', location: 'Surulere', rating: 4.5, review: 67, distance: 5.6, price: 3500, available: true },
    { id: 'samuel-eze', name: 'Samuel Eze', job: 'Electrician', category: 'ELECTRICAL', serviceTitle: 'Socket and wiring repairs', location: 'Lekki Phase 1', rating: 4.4, review: 24, distance: 7.2, price: 4200, available: true },
    { id: 'ifeoma-nnaji', name: 'Ifeoma Nnaji', job: 'Plumber', category: 'PLUMBING', serviceTitle: 'Bathroom pipe repairs', location: 'Victoria Island', rating: 4.3, review: 19, distance: 9.5, price: 3800, available: false },
];

const quickFilters = [
    { id: 'all', label: 'All providers' },
    { id: 'rating', label: '4.8+ rating', icon: 'fa-solid fa-star' },
    { id: 'price', label: 'Under ₦5,000/hr', icon: 'fa-solid fa-naira-sign' },
    { id: 'available', label: 'Available now', icon: 'fa-solid fa-bolt' },
    { id: 'nearby', label: 'Within 3 km', icon: 'fa-solid fa-location-crosshairs' },
];

function Home({ onSelectProvider, onNavigate, onAuth, onRequireAuth, user, isAuthenticated = false }) {
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
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        if (!filtersOpen || window.innerWidth > 760) return undefined;
        const panel = document.querySelector('.marketplace-filter-panel.is-open');
        const previouslyFocused = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const focusable = panel?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled])');
        focusable?.[0]?.focus();
        function handleFilterKeys(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                setFiltersOpen(false);
                document.querySelector('.marketplace-mobile-filter-button')?.focus();
                return;
            }
            if (event.key !== 'Tab' || !focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        document.addEventListener('keydown', handleFilterKeys);
        return () => {
            document.removeEventListener('keydown', handleFilterKeys);
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [filtersOpen]);

    const filteredProviders = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
        const result = providers.filter((provider) => {
            const searchable = [provider.name, provider.job, provider.serviceTitle, provider.category].join(' ').toLowerCase();
            const matchesSearch = !searchValue || searchable.includes(searchValue);
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

    const selectCategory = (category) => {
        setSearch(category);
        setQuickFilter('all');
        setVisibleCount(4);
    };

    return (
        <div className="home page-surface home-marketplace">\n            <PublicHeader user={user} onNavigate={onNavigate} onAuth={onAuth} active="marketplace" />
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
                    <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(4); }} placeholder="Find a plumber, electrician, cleaner..." aria-label="Search services" />
                    <button type="button" className="marketplace-filter-trigger" aria-label="Open filters" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
                        <i className="fa-solid fa-sliders" aria-hidden="true"></i>
                    </button>
                </label>
            </header>

            <main className="home-main marketplace-main">
                <section className="marketplace-hero" aria-labelledby="marketplace-hero-title">
                    <div className="marketplace-hero-art" aria-hidden="true"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                    <div className="marketplace-hero-copy">
                        <span className="marketplace-eyebrow"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i> HOME SERVICES, MADE SIMPLE</span>
                        <h1 id="marketplace-hero-title">Get your home fixed by people you can trust.</h1>
                        <p>Find local service providers, compare their rates, and choose the right person for the job.</p>
                        <button type="button" className="marketplace-hero-button" onClick={() => document.getElementById('provider-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                            Find a professional <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div className="marketplace-hero-benefits" aria-label="Ways to compare providers">
                        <div><i className="fa-solid fa-user-check" aria-hidden="true"></i><span>Review profiles</span></div>
                        <div><i className="fa-solid fa-star" aria-hidden="true"></i><span>Compare ratings</span></div>
                        <div><i className="fa-solid fa-naira-sign" aria-hidden="true"></i><span>Compare rates</span></div>
                    </div>
                </section>

                <section className="marketplace-categories" aria-labelledby="categories-title">
                    <div className="marketplace-section-heading">
                        <div>
                            <h2 id="categories-title">Popular services</h2>
                            <p>What do you need help with?</p>
                        </div>
                        <button type="button" className="marketplace-text-button" onClick={() => { setSearch(''); setQuickFilter('all'); setVisibleCount(4); }}>Clear category</button>
                    </div>
                    <div className="marketplace-category-list">
                        {categories.map((category) => (
                            <Category key={category.name} {...category} onSelect={() => selectCategory(category.name)} />
                        ))}
                    </div>
                </section>

                <section className="marketplace-discovery" aria-label="Find service providers" id="provider-results">
                    <div className="marketplace-discovery-heading">
                        <div>
                            <span className="marketplace-eyebrow-dark">DISCOVER LOCAL HELP</span>
                            <h2>Find the right professional</h2>
                        </div>
                        <button type="button" className="marketplace-mobile-filter-button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
                            <i className="fa-solid fa-sliders" aria-hidden="true"></i> Filters
                        </button>
                    </div>

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
                        {filtersOpen && <button type="button" className="marketplace-filter-backdrop" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
                        <aside className={`service-filters marketplace-filter-panel${filtersOpen ? ' is-open' : ''}`} aria-label="Detailed filters" role={filtersOpen ? "dialog" : undefined} aria-modal={filtersOpen ? true : undefined}>
                            <div className="filter-heading">
                                <h2>Refine results</h2>
                                <button type="button" onClick={resetFilters}>Reset all</button>
                                <button type="button" className="marketplace-filter-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                            </div>

                            <div className="filter-group">
                                <h3>Hourly rate (₦)</h3>
                                <div className="price-inputs">
                                    <input type="number" min={PRICE_MIN} max={maxPrice - 1} value={minPrice} aria-label="Minimum hourly price" onChange={(event) => setMinPrice(Math.min(Math.max(Number(event.target.value) || PRICE_MIN, PRICE_MIN), maxPrice - 1))} />
                                    <input type="number" min={minPrice + 1} max={PRICE_MAX} value={maxPrice} aria-label="Maximum hourly price" onChange={(event) => setMaxPrice(Math.max(Math.min(Number(event.target.value) || PRICE_MAX, PRICE_MAX), minPrice + 1))} />
                                </div>
                                <DoubleRangeSlider min={PRICE_MIN} max={PRICE_MAX} minValue={minPrice} maxValue={maxPrice} onChange={(nextMin, nextMax) => { setMinPrice(nextMin); setMaxPrice(nextMax); }} />
                            </div>

                            <fieldset className="filter-group option-group">
                                <legend>Minimum rating</legend>
                                <label><input type="radio" name="rating" value="4.8" checked={rating === '4.8'} onChange={(event) => setRating(event.target.value)} /> 4.8 and above</label>
                                <label><input type="radio" name="rating" value="4.5" checked={rating === '4.5'} onChange={(event) => setRating(event.target.value)} /> 4.5 and above</label>
                                <label><input type="radio" name="rating" value="4" checked={rating === '4'} onChange={(event) => setRating(event.target.value)} /> 4.0 and above</label>
                                <button type="button" className="marketplace-clear-option" onClick={() => setRating('')}>Any rating</button>
                            </fieldset>

                            <fieldset className="filter-group option-group">
                                <legend>Distance</legend>
                                <label><input type="radio" name="distance" value="3" checked={distance === '3'} onChange={(event) => setDistance(event.target.value)} /> Within 3 km</label>
                                <label><input type="radio" name="distance" value="5" checked={distance === '5'} onChange={(event) => setDistance(event.target.value)} /> Within 5 km</label>
                                <label><input type="radio" name="distance" value="10" checked={distance === '10'} onChange={(event) => setDistance(event.target.value)} /> Within 10 km</label>
                                <button type="button" className="marketplace-clear-option" onClick={() => setDistance('')}>Any distance</button>
                            </fieldset>

                            <label className="marketplace-availability">
                                <span><strong>Available now</strong><small>Only show providers marked available</small></span>
                                <input type="checkbox" checked={availableNow} onChange={(event) => setAvailableNow(event.target.checked)} />
                            </label>
                            <button type="button" className="marketplace-apply-filters" onClick={() => setFiltersOpen(false)}>Show {filteredProviders.length} results</button>
                        </aside>

                        <div className="marketplace-provider-results">
                            <div className="marketplace-results-heading">
                                <div>
                                    <h2>Service providers near you</h2>
                                    <p>{filteredProviders.length} matching sample listings</p>
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
                                    <ServiceProvider key={provider.id} {...provider} isAuthenticated={isAuthenticated} onRequireAuth={onRequireAuth} onSelect={() => onSelectProvider(provider)} />
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
                        <h2 id="protection-title">Make an informed choice</h2>
                        <p>Check provider profiles, service details, customer ratings, and pricing before deciding who to contact. Confirm the agreed scope and price before work begins.</p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
