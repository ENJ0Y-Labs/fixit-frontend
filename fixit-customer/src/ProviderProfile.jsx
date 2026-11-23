import './styles/pages/home.css';
import './styles/pages/landing.css';
import Footer from './Footer';
import PublicHeader from './PublicHeader';

function ProviderProfile({ provider, user, onNavigate, onAuth, onRequireAuth }) {
    if (!provider) return <div className="fixit-landing">
        <PublicHeader user={user} onNavigate={onNavigate} onAuth={onAuth} active="marketplace" />
        <main className="fixit-provider-not-found"><h1>Provider not found</h1><p>This sample listing is unavailable. Return to the marketplace to explore other providers.</p><button type="button" onClick={() => onNavigate('marketplace')}>Back to marketplace</button></main>
        <Footer />
    </div>;
    return <div className="fixit-landing">
        <PublicHeader user={user} onNavigate={onNavigate} onAuth={onAuth} active="marketplace" />
        <main className="fixit-provider-profile">
            <button type="button" className="fixit-provider-back" onClick={() => onNavigate('marketplace')}><i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to marketplace</button>
            <section className="fixit-provider-profile-card">
                <div className="fixit-provider-profile-icon"><i className="fa-solid fa-user" aria-hidden="true"></i></div>
                <div className="fixit-provider-profile-main">
                    <span className="fixit-landing-eyebrow">PUBLIC PROVIDER PROFILE · SAMPLE LISTING</span>
                    <h1>{provider.name}</h1><p className="fixit-provider-role">{provider.job}</p><p>{provider.serviceTitle}</p>
                    <div className="fixit-provider-meta">
                        <span><i className="fa-solid fa-star" aria-hidden="true"></i> {provider.rating.toFixed(1)} ({provider.review} sample reviews)</span>
                        <span><i className="fa-solid fa-location-dot" aria-hidden="true"></i> {provider.location}</span>
                        <span><i className="fa-solid fa-naira-sign" aria-hidden="true"></i> ₦{provider.price.toLocaleString('en-NG')}/hr indicative rate</span>
                    </div>
                    <p className="fixit-provider-disclaimer">Illustrative marketplace data, not a verified live provider profile. Confirm availability, scope and final pricing before work begins.</p>
                    <button type="button" className="fixit-landing-primary" onClick={() => onRequireAuth({ returnTo: 'post-job', action: () => onNavigate('post-job') })}>Request this service <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                </div>
            </section>
        </main>
        <Footer />
    </div>;
}
export default ProviderProfile;
