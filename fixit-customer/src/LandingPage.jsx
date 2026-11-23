import './styles/pages/home.css';
import './styles/pages/landing.css';
import Footer from './Footer';
import PublicHeader from './PublicHeader';

const categories = [
    { name: 'Plumbing', icon: 'fa-faucet', description: 'Leaks, pipes and installations' },
    { name: 'Electrical', icon: 'fa-bolt', description: 'Repairs, wiring and fittings' },
    { name: 'Cleaning', icon: 'fa-broom', description: 'Regular and deep cleaning' },
    { name: 'Carpentry', icon: 'fa-hammer', description: 'Furniture and woodwork' },
    { name: 'Painting', icon: 'fa-paint-roller', description: 'Interior and exterior painting' },
];

function LandingPage({ user, onNavigate, onAuth }) {
    return (
        <div className="fixit-landing">
            <PublicHeader user={user} onNavigate={onNavigate} onAuth={onAuth} active="landing" />
            <main>
                <section className="fixit-landing-hero">
                    <div className="fixit-landing-copy">
                        <span className="fixit-landing-eyebrow"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i> TRUSTED HOME SERVICES</span>
                        <h1>Good help for your home, without the guesswork.</h1>
                        <p>Find skilled local professionals, compare their services and rates, and choose the right person for the job.</p>
                        <div className="fixit-landing-actions">
                            <button type="button" className="fixit-landing-primary" onClick={() => onNavigate('marketplace')}>Explore marketplace <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                            <button type="button" className="fixit-landing-secondary" onClick={() => onAuth('signup', 'landing')}>Create an account</button>
                        </div>
                        <p className="fixit-landing-note">Browse first. Sign in only when you are ready to request a service.</p>
                    </div>
                    <div className="fixit-landing-art" aria-hidden="true">
                        <div className="fixit-landing-art-orbit"></div>
                        <div className="fixit-landing-tool"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                        <div className="fixit-landing-art-card"><i className="fa-solid fa-circle-check"></i><span>Find trusted local help</span></div>
                    </div>
                </section>
                <section className="fixit-landing-categories" aria-labelledby="landing-categories-title">
                    <div className="fixit-landing-section-heading">
                        <div><span>START WITH WHAT YOU NEED</span><h2 id="landing-categories-title">What needs fixing?</h2></div>
                        <button type="button" onClick={() => onNavigate('marketplace')}>View all services <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                    <div className="fixit-landing-category-grid">
                        {categories.map((category) => <button type="button" className="fixit-landing-category" key={category.name} onClick={() => onNavigate('marketplace?category=' + encodeURIComponent(category.name))}>
                            <span><i className={'fa-solid ' + category.icon} aria-hidden="true"></i></span><strong>{category.name}</strong><small>{category.description}</small>
                        </button>)}
                    </div>
                </section>
                <section className="fixit-landing-how" aria-labelledby="landing-how-title">
                    <div className="fixit-landing-section-heading"><div><span>HOW FIXIT WORKS</span><h2 id="landing-how-title">From problem to solved</h2></div></div>
                    <div className="fixit-landing-steps">
                        <article><span>01</span><i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i><h3>Explore services</h3><p>Search categories and compare available public provider details without signing in.</p></article>
                        <article><span>02</span><i className="fa-solid fa-user-check" aria-hidden="true"></i><h3>Choose a professional</h3><p>Review available service details, rates and customer ratings before deciding.</p></article>
                        <article><span>03</span><i className="fa-solid fa-clipboard-check" aria-hidden="true"></i><h3>Request the service</h3><p>Sign in when you are ready to submit a job or manage your booking.</p></article>
                    </div>
                </section>
                <section className="fixit-landing-bottom-cta">
                    <div><span>READY WHEN YOU ARE</span><h2>Your next home fix starts here.</h2><p>Explore the marketplace. No account needed to look around.</p></div>
                    <button type="button" onClick={() => onNavigate('marketplace')}>Browse providers <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                </section>
            </main>
            <Footer />
        </div>
    );
}
export default LandingPage;
