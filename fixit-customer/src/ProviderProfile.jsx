import { useEffect, useState } from 'react';
import './styles/pages/home.css';
import './styles/pages/landing.css';
import Footer from './Footer';
import PublicHeader from './PublicHeader';
import { loadPublicProvider } from './home/publicProviders.js';

function ProviderProfile({ provider: initialProvider, user, onNavigate, onAuth, onRequireAuth }) {
    const [profileState, setProfileState] = useState({ provider: initialProvider || null, source: 'loading', error: null });
    const providerId = initialProvider?.id || window.location.hash.replace(/^#\/?/, '').split('?')[0].replace(/^provider\//, '');

    useEffect(() => {
        let active = true;
        if (providerId) {
            loadPublicProvider(providerId).then((result) => { if (active) setProfileState(result); });
        }
        return () => { active = false; };
    }, [providerId]);

    const provider = profileState.provider;
    const requestService = () => onRequireAuth({ returnTo: 'post-job', action: () => onNavigate('post-job') });

    return <div className="fixit-landing">
        <PublicHeader user={user} onNavigate={onNavigate} onAuth={onAuth} active="marketplace" />
        {profileState.source === 'loading' && providerId && <main className="fixit-provider-not-found" role="status"><p>Loading provider profile…</p></main>}
        {(profileState.source !== 'loading' || !providerId) && !provider && <main className="fixit-provider-not-found">
            <h1>Provider profile unavailable</h1>
            <p>{profileState.error || (providerId ? 'This provider profile could not be found or is not publicly available.' : 'A provider ID is required.')}</p>
            <button type="button" onClick={() => onNavigate('marketplace')}>Back to marketplace</button>
        </main>}
        {provider && <main className="fixit-provider-profile">
            <button type="button" className="fixit-provider-back" onClick={() => onNavigate('marketplace')}><i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to marketplace</button>
            <section className="fixit-provider-profile-card">
                <div className="fixit-provider-profile-icon">{provider.avatarUrl ? <img src={provider.avatarUrl} alt="" /> : <i className="fa-solid fa-user" aria-hidden="true"></i>}</div>
                <div className="fixit-provider-profile-main">
                    <span className="fixit-landing-eyebrow">PUBLIC PROVIDER PROFILE{profileState.source === 'sample' ? ' · SAMPLE LISTING' : ''}</span>
                    <h1>{provider.name}</h1><p className="fixit-provider-role">{provider.job}</p>
                    {provider.serviceTitle && <p>{provider.serviceTitle}</p>}
                    {provider.description && <p>{provider.description}</p>}
                    <div className="fixit-provider-meta">
                        {provider.rating !== null && <span><i className="fa-solid fa-star" aria-hidden="true"></i> {provider.rating.toFixed(1)}{provider.review !== null ? ` (${provider.review} reviews)` : ''}</span>}
                        {provider.location && <span><i className="fa-solid fa-location-dot" aria-hidden="true"></i> {provider.location}</span>}
                        {provider.price !== null && <span><i className="fa-solid fa-naira-sign" aria-hidden="true"></i> ₦{provider.price.toLocaleString('en-NG')}/hr indicative rate</span>}
                        {provider.verificationStatus && <span><i className="fa-solid fa-shield-halved" aria-hidden="true"></i> {provider.verificationStatus.replaceAll('_', ' ')}</span>}
                    </div>
                    {provider.services?.length > 0 && <section className="fixit-provider-detail-section"><h2>Services</h2><ul>{provider.services.map((service, index) => <li key={service.name + index}><strong>{service.name || 'Service'}</strong>{service.description && <p>{service.description}</p>}</li>)}</ul></section>}
                    {provider.serviceAreas?.length > 0 && <section className="fixit-provider-detail-section"><h2>Service areas</h2><p>{provider.serviceAreas.join(', ')}</p></section>}
                    {provider.credentials?.length > 0 && <section className="fixit-provider-detail-section"><h2>Public credentials</h2><ul>{provider.credentials.map((credential) => <li key={credential}>{credential}</li>)}</ul></section>}
                    {provider.reviews?.length > 0 && <section className="fixit-provider-detail-section"><h2>Customer reviews</h2><ul>{provider.reviews.map((review, index) => <li key={review.id || index}>{review.author && <strong>{review.author}</strong>}{review.rating !== null && <span> · {review.rating.toFixed(1)}/5</span>}{review.comment && <p>{review.comment}</p>}</li>)}</ul></section>}
                    {profileState.source === 'sample' && <p className="fixit-provider-disclaimer">This is illustrative sample data, not a live or verified provider profile. No real rating, review, credential or verification claim is being made.</p>}
                    {profileState.source === 'api' && profileState.reviewsError && <p className="fixit-provider-disclaimer" role="status">{profileState.reviewsError}</p>}
                    <button type="button" className="fixit-landing-primary" onClick={requestService}>Request this service <i className="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                </div>
            </section>
        </main>}
        <Footer />
    </div>;
}
export default ProviderProfile;
