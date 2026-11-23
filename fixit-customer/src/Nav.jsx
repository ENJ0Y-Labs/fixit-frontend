const navItems = [
    { id: 'home', label: 'Marketplace', icon: 'fa-solid fa-house' },
    { id: 'myJobs', label: 'My Jobs', icon: 'fa-solid fa-briefcase' },
    { id: 'account', label: 'My Account', icon: 'fa-solid fa-user' }
];

function Nav({ activePage, onNavigate, user, onLogout, isOpen, onClose, sidebarRef }) {
    const displayName = user?.name || user?.fullName || user?.email || 'Customer account';
    const initials = displayName.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'CU';

    return (
        <aside ref={sidebarRef} className={`customer-sidebar${isOpen ? ' is-open' : ''}`} id="customer-navigation" aria-label="Customer navigation" role={isOpen ? 'dialog' : undefined} aria-modal={isOpen ? true : undefined}>
            <a className="customer-brand" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home'); }} aria-label="FixIt customer workspace">
                <img className="customer-brand-logo" src="/brand/logo.png" alt="" />
                <span className="customer-brand-copy">
                    <strong>FixIt</strong>
                    <small>Customer workspace</small>
                    <span>Trusted help for every home.</span>
                </span>
            </a>
            <button className="customer-sidebar-close" type="button" onClick={onClose}>Close navigation</button>
            <p className="customer-nav-label">Workspace</p>
            <nav className="customer-nav-links" aria-label="Main navigation">
                {navItems.map((item) => {
                    const isActive = activePage === item.id || (item.id === 'myJobs' && ['postJob', 'jobDetails', 'payment', 'review'].includes(activePage));
                    return (
                        <button key={item.id} type="button" className="customer-nav-link" onClick={() => onNavigate(item.id)} aria-current={isActive ? 'page' : undefined}>
                            <span className="customer-nav-icon" aria-hidden="true"><i className={item.icon} /></span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
            <button type="button" className="customer-post-job" onClick={() => onNavigate('postJob')}>
                <i className="fa-solid fa-plus" aria-hidden="true" />
                <span>Post a Job</span>
            </button>
            <div className="customer-sidebar-footer">
                <div className="customer-user">
                    <span className="customer-user-avatar" aria-hidden="true">{initials}</span>
                    <span className="customer-user-copy"><strong>{displayName}</strong><small>Customer account</small></span>
                </div>
                <button type="button" className="customer-signout" onClick={onLogout}>
                    <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
}

export default Nav;
