const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-solid fa-house' },
    { id: 'myJobs', label: 'My Jobs', icon: 'fa-solid fa-briefcase' },
    { id: 'messages', label: 'Messages', icon: 'fa-solid fa-message' },
    { id: 'account', label: 'Profile', icon: 'fa-solid fa-user' }
];

function Nav({ activePage, onNavigate }) {
    return (
        <nav className="sidebar" aria-label="Primary navigation">
            <div className="logo">
                <div className="logo-icon">F</div>
                <div className="logo-text">FixIt</div>
            </div>

            <div className="nav-links">
                {navItems.map((item) => {
                    const isActive = activePage === item.id;
                    const disabled = item.id === 'settings';

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`nav-item${isActive ? ' active' : ''}`}
                            onClick={() => !disabled && onNavigate(item.id)}
                            disabled={disabled}
                            aria-current={isActive ? 'page' : undefined}
                            title={disabled ? `${item.label} is not implemented yet` : undefined}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            <button type="button" className="post-job-button" onClick={() => onNavigate('postJob')}>
                <i className="fa-solid fa-plus"></i>
                <span>Post a Job</span>
            </button>

            <div className="user-profile">
                <div className="user-avatar" aria-hidden="true">
                    <i className="fa-solid fa-user"></i>
                </div>
                <div className="user-info">
                    <div className="user-name">O. Ajayi</div>
                    <div className="user-role">Lekki Phase 1</div>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
