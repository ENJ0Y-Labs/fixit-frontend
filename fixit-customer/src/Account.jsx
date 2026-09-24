import './styles/pages/account.css';
import { useState } from 'react';
import avatarPlaceholder from './assets/avatar-placeholder.svg';
import Toggle from './Toggle';

function Account() {
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Oluwatobiloba Ajayi',
        email: 't.ajayi@example.com',
        phone: '+234 802 ••• 1234',
    });
    const [draft, setDraft] = useState(profile);
    const [saved, setSaved] = useState(false);

    const startEditing = () => {
        setDraft(profile);
        setEditing(true);
        setSaved(false);
    };

    const saveProfile = (event) => {
        event.preventDefault();
        if (!draft.name.trim() || !draft.email.trim()) return;
        const nextProfile = { ...draft, name: draft.name.trim(), email: draft.email.trim() };
        setProfile(nextProfile);
        setDraft(nextProfile);
        setEditing(false);
        setSaved(true);
    };

    return (
        <div className="account page-surface">
            <header className="page-header"><h1>My Profile</h1></header>
            <main className="account-main">
                <section className="profile-card" aria-labelledby="profile-name">
                    <div className="profile-image-wrap">
                        <img src={avatarPlaceholder} alt="Profile" />
                        <button type="button" className="camera-button" aria-label="Change profile picture">
                            <i className="fa-solid fa-camera"></i>
                        </button>
                    </div>

                    <div className="profile-copy">
                        {editing ? (
                            <form onSubmit={saveProfile} className="profile-edit-form">
                                <input aria-label="Full name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
                                <input type="email" aria-label="Email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
                                <input aria-label="Phone" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
                                <div className="profile-edit-actions">
                                    <button type="button" className="outline-button" onClick={() => setEditing(false)}>Cancel</button>
                                    <button type="submit" className="dark-button">Save Changes</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h2 id="profile-name">{profile.name}</h2>
                                <div className="profile-contact">
                                    <p><i className="fa-solid fa-envelope-open" aria-hidden="true"></i>{profile.email}</p>
                                    <p><i className="fa-solid fa-phone" aria-hidden="true"></i>{profile.phone}</p>
                                </div>
                                <button type="button" className="outline-button" onClick={startEditing}>Edit Profile</button>
                            </>
                        )}
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
                            <SettingRow icon="fa-solid fa-bell" title="Notifications" text="Manage alerts and email preferences" control={<Toggle label="Notifications" isOn={false} onChange={() => {}} />} />
                            <SettingRow icon="fa-solid fa-circle-question" title="Help & Support" text="FAQs, Chat Support, and Legal" />
                            <SettingRow icon="fa-solid fa-shield-halved" title="Security" text="Password, 2FA, and Logged devices" />
                        </div>
                    </div>

                    <div className="account-footer">
                        {saved ? <p>Profile changes saved.</p> : <p>FixIt App Version 1.0.4</p>}
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
            <div className="setting-icon" aria-hidden="true"><i className={icon}></i></div>
            <div className="setting-copy"><p>{title}</p><p>{text}</p></div>
            {control ?? <i className="fa-solid fa-angle-right setting-arrow" aria-hidden="true"></i>}
        </div>
    );
}

export default Account;
