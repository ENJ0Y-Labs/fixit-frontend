function PublicHeader({ user, onNavigate, onAuth, active = '' }) {
    return (
        <header className="fixit-public-header">
            <a className="fixit-public-brand" href="#landing" onClick={(event) => { event.preventDefault(); onNavigate('landing'); }}>
                <img src="/brand/logo.png" alt="" /><span>FixIt</span>
            </a>
            <nav className="fixit-public-links" aria-label="Public navigation">
                <button type="button" className={active === 'landing' ? 'is-active' : ''} onClick={() => onNavigate('landing')}>Home</button>
                <button type="button" className={active === 'marketplace' ? 'is-active' : ''} onClick={() => onNavigate('marketplace')}>Marketplace</button>
                {!user && <button type="button" onClick={() => onAuth('login', 'post-job')}>Post a job</button>}
            </nav>
            <div className="fixit-public-actions">
                {user ? <button type="button" className="fixit-public-primary" onClick={() => onNavigate('my-jobs')}>My account</button> : <>
                    <button type="button" className="fixit-public-login" onClick={() => onAuth('login', 'landing')}>Sign in</button>
                    <button type="button" className="fixit-public-primary" onClick={() => onAuth('signup', 'landing')}>Get started</button>
                </>}
            </div>
        </header>
    );
}
export default PublicHeader;
