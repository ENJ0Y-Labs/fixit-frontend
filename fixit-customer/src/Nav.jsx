const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
    { id: 'myJobs', label: 'My Jobs', icon: 'fa-solid fa-briefcase' },
    { id: 'account', label: 'Profile', icon: 'fa-solid fa-user' }
];

function Nav({ activePage, onNavigate, user, onLogout }) {
    return (
        <nav className="sidebar" aria-label="Primary navigation">
            <div className="logo">
                <img className="brand-logo customer-brand-logo" src="/brand/logo.png" alt="" />
                <div className="logo-copy">
                    <div className="logo-text">FixIt</div>
                    <span className="brand-tagline">Trusted help for every home.</span>
                </div>
            </div>

            <div className="nav-links">
                {navItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`nav-item${isActive ? ' active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <i aria-hidden="true" className={item.icon}></i>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            <button type="button" className="post-job-button" onClick={() => onNavigate('postJob')}>
                <i aria-hidden="true" className="fa-solid fa-plus"></i>
                <span>Post a Job</span>
            </button>

            <div className="user-profile">
                <div className="user-avatar" aria-hidden="true">
                    <i aria-hidden="true" className="fa-solid fa-user"></i>
                </div>
                <div className="user-info">
                    <div className="user-name">{user?.name || user?.fullName || user?.email || "Customer account"}</div>
                    <div className="user-role">Customer account</div>
                </div>
            </div>
            <button type="button" className="nav-item customer-logout-button" onClick={onLogout}>
                <i aria-hidden="true" className="fa-solid fa-right-from-bracket"></i>
                <span>Sign out</span>
            </button>
        </nav>
    );
}

export default Nav;
