import avatarPlaceholder from './assets/avatar-placeholder.svg';
import Toggle from './Toggle';

function Account() {
    return (
        <div className="account page-surface">
            <header className="page-header">
                <h1>My Profile</h1>
            </header>

            <main className="account-main">
                <section className="profile-card" aria-labelledby="profile-name">
                    <div className="profile-image-wrap">
                        <img src={avatarPlaceholder} alt="Profile" />
                        <button type="button" className="camera-button" aria-label="Change profile picture">
                            <i className="fa-solid fa-camera"></i>
                        </button>
                    </div>

                    <div className="profile-copy">
                        <h2 id="profile-name">Oluwatobiloba Ajayi</h2>
                        <div className="profile-contact">
                            <p>
                                <i className="fa-solid fa-envelope-open" aria-hidden="true"></i>
                                t.ajayi@example.com
                            </p>
                            <p>
                                <i className="fa-solid fa-phone" aria-hidden="true"></i>
                                +234 802 ••• 1234
                            </p>
                        </div>
                        <button type="button" className="outline-button">Edit Profile</button>
                    </div>
                </section>

                <section className="account-grid" aria-label="Account settings">
                    <div className="settings-panel">
                        <h2 className="section-label">ACCOUNT SETTINGS</h2>
                        <div className="settings-card">
                            <SettingRow icon="fa-solid fa-location-dot" title="Saved Addresses" text="Home, Work, and 2 other locations" />
                            <SettingRow icon="fa-solid fa-credit-card" title="Payment Methods" text="Mastercard ending in 4242" />
                            <SettingRow icon="fa-solid fa-clock-rotate-left" title="Job History" text="View all your past bookings" />
                        </div>
                    </div>

                    <div className="settings-panel">
                        <h2 className="section-label">PREFERENCES</h2>
                        <div className="settings-card">
                            <SettingRow
                                icon="fa-solid fa-bell"
                                title="Notifications"
                                text="Manage alerts and email preferences"
                                control={<Toggle label="Notifications" />}
                            />
                            <SettingRow icon="fa-solid fa-circle-question" title="Help & Support" text="FAQs, Chat Support, and Legal" />
                            <SettingRow icon="fa-solid fa-shield-halved" title="Security" text="Password, 2FA, and Logged devices" />
                        </div>
                    </div>

                    <div className="account-footer">
                        <p>FixIt App Version 1.0.4</p>
                        <div>
                            <button type="button">Privacy Policy</button>
                            <button type="button">Terms of Service</button>
                            <button type="button">Safety Tips</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function SettingRow({ icon, title, text, control }) {
    return (
        <div className="setting-row">
            <div className="setting-icon" aria-hidden="true">
                <i className={icon}></i>
            </div>
            <div className="setting-copy">
                <p>{title}</p>
                <p>{text}</p>
            </div>
            {control ?? (
                <i className="fa-solid fa-angle-right setting-arrow" aria-hidden="true"></i>
            )}
        </div>
    );
}

export default Account;
