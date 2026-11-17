import './styles/pages/account.css';
import { useRef, useState } from 'react';
import avatarPlaceholder from './assets/avatar-placeholder.svg';

const initialProfile = {
    name: 'Oluwatobiloba Ajayi',
    email: 't.ajayi@example.com',
    phone: '+234 802 ••• 1234',
};

const settingsSections = [
    { id: 'personal-information', label: 'Personal details' },
    { id: 'saved-addresses', label: 'Addresses' },
    { id: 'payment-methods', label: 'Payments' },
    { id: 'preferences-security', label: 'Preferences' },
    { id: 'support-trust', label: 'Support' },
];

function Account() {
    const [profile, setProfile] = useState(initialProfile);
    const [draft, setDraft] = useState(initialProfile);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState(avatarPlaceholder);
    const [feedback, setFeedback] = useState('');
    const fileInputRef = useRef(null);

    const startEditing = () => {
        setDraft(profile);
        setEditing(true);
        setFeedback('');
    };

    const cancelEditing = () => {
        setDraft(profile);
        setEditing(false);
        setFeedback('');
    };

    const saveProfile = (event) => {
        event.preventDefault();
        const name = draft.name.trim();
        const email = draft.email.trim();
        const phone = draft.phone.trim();

        if (!name || !email || !phone) {
            setFeedback('Complete all profile fields before saving.');
            return;
        }

        setProfile({ name, email, phone });
        setDraft({ name, email, phone });
        setEditing(false);
        setFeedback('Your profile changes have been saved in this session.');
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setFeedback('Choose an image file to preview your profile photo.');
            event.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setFeedback('Choose an image smaller than 5 MB.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setAvatar(reader.result);
                setFeedback('Photo preview updated. Profile photo upload is not connected yet.');
            }
        };
        reader.onerror = () => setFeedback('The selected image could not be previewed.');
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const shareProfile = async () => {
        const shareText = [profile.name, profile.email, profile.phone].filter(Boolean).join('\n');

        try {
            if (navigator.share) {
                await navigator.share({ title: 'My FixIt profile', text: shareText });
                setFeedback('Profile shared.');
                return;
            }

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareText);
                setFeedback('Profile details copied to your clipboard.');
                return;
            }

            setFeedback('Profile sharing is not available in this browser.');
        } catch (error) {
            if (error?.name !== 'AbortError') {
                setFeedback('Your profile could not be shared. Try again.');
            }
        }
    };

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="account page-surface">
            <header className="account-header">
                <div className="account-heading-copy">
                    <nav className="account-breadcrumb" aria-label="Breadcrumb">
                        <span>FixIt Workspace</span>
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                        <span>Profile</span>
                    </nav>
                    <div className="account-title-row">
                        <h1>Account &amp; Profile Settings</h1>
                        <span className="account-preview-badge">Profile preview</span>
                    </div>
                    <p>Manage your personal details and review the account settings available in your FixIt customer profile.</p>
                </div>
                <div className="account-header-actions">
                    <button type="button" className="account-secondary-button" onClick={shareProfile}>
                        <i className="fa-solid fa-share-nodes" aria-hidden="true"></i>
                        <span>Share Profile</span>
                    </button>
                    {!editing && (
                        <button type="button" className="account-primary-button" onClick={startEditing}>
                            <i className="fa-solid fa-pen" aria-hidden="true"></i>
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="account-main">
                <div className="account-workspace">
                    <aside className="account-sidebar">
                        <section className="account-identity-card" aria-labelledby="account-profile-name">
                            <div className="account-avatar-wrap">
                                <img src={avatar} alt="Customer profile" className="account-avatar" />
                                <button
                                    type="button"
                                    className="account-camera-button"
                                    aria-label="Choose a profile photo"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <i className="fa-solid fa-camera" aria-hidden="true"></i>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    className="account-file-input"
                                    type="file"
                                    accept="image/*"
                                    aria-label="Choose profile photo"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <span className="account-eyebrow">Customer account</span>
                            <h2 id="account-profile-name">{profile.name}</h2>
                            <p className="account-identity-caption">Your FixIt customer profile</p>
                            <div className="account-contact-list">
                                <div>
                                    <i className="fa-regular fa-envelope" aria-hidden="true"></i>
                                    <span>{profile.email}</span>
                                </div>
                                <div>
                                    <i className="fa-solid fa-phone" aria-hidden="true"></i>
                                    <span>{profile.phone}</span>
                                </div>
                            </div>
                            <button type="button" className="account-edit-profile-button" onClick={startEditing}>
                                <i className="fa-solid fa-pen" aria-hidden="true"></i>
                                Edit personal details
                            </button>
                        </section>

                        <section className="account-note-card">
                            <span className="account-note-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i></span>
                            <div>
                                <h3>Keep your account details current</h3>
                                <p>Accurate contact information helps FixIt display the right details when you manage a service request.</p>
                            </div>
                        </section>

                        <nav className="account-section-nav" aria-label="Profile settings sections">
                            <p>SETTINGS</p>
                            {settingsSections.map((section) => (
                                <button key={section.id} type="button" onClick={() => scrollToSection(section.id)}>
                                    {section.label}
                                    <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <div className="account-content">
                        <section className="account-panel" id="personal-information" aria-labelledby="personal-information-title">
                            <div className="account-panel-heading">
                                <div>
                                    <span className="account-panel-kicker">YOUR DETAILS</span>
                                    <h2 id="personal-information-title">Personal Information</h2>
                                    <p>Update the name and contact details shown on your customer profile.</p>
                                </div>
                                <span className="account-panel-icon"><i className="fa-regular fa-id-card" aria-hidden="true"></i></span>
                            </div>

                            <form className="account-profile-form" onSubmit={saveProfile}>
                                <div className="account-field">
                                    <label htmlFor="account-full-name">Full name</label>
                                    <input
                                        id="account-full-name"
                                        type="text"
                                        autoComplete="name"
                                        value={draft.name}
                                        readOnly={!editing}
                                        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                                    />
                                </div>
                                <div className="account-field">
                                    <label htmlFor="account-email">Email address</label>
                                    <input
                                        id="account-email"
                                        type="email"
                                        autoComplete="email"
                                        value={draft.email}
                                        readOnly={!editing}
                                        onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                                    />
                                </div>
                                <div className="account-field account-field-wide">
                                    <label htmlFor="account-phone">Phone number</label>
                                    <input
                                        id="account-phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={draft.phone}
                                        readOnly={!editing}
                                        onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
                                    />
                                </div>
                                {editing && (
                                    <div className="account-form-actions">
                                        <button type="button" className="account-secondary-button" onClick={cancelEditing}>Cancel</button>
                                        <button type="submit" className="account-primary-button">
                                            <i className="fa-solid fa-check" aria-hidden="true"></i>
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </section>

                        <section className="account-panel" id="saved-addresses" aria-labelledby="saved-addresses-title">
                            <div className="account-panel-heading">
                                <div>
                                    <span className="account-panel-kicker">SERVICE LOCATIONS</span>
                                    <h2 id="saved-addresses-title">Saved Service Addresses</h2>
                                    <p>Keep service locations ready for future job requests.</p>
                                </div>
                                <span className="account-panel-icon"><i className="fa-solid fa-location-dot" aria-hidden="true"></i></span>
                            </div>
                            <EmptySettingState
                                icon="fa-solid fa-map-location-dot"
                                title="Address management is not connected yet"
                                description="Saved addresses will appear here when the customer address service is available."
                            />
                        </section>

                        <section className="account-panel" id="payment-methods" aria-labelledby="payment-methods-title">
                            <div className="account-panel-heading">
                                <div>
                                    <span className="account-panel-kicker">PAYMENTS</span>
                                    <h2 id="payment-methods-title">Payment Methods</h2>
                                    <p>Payment options will be shown here when a supported payment integration is connected.</p>
                                </div>
                                <span className="account-panel-icon"><i className="fa-regular fa-credit-card" aria-hidden="true"></i></span>
                            </div>
                            <EmptySettingState
                                icon="fa-solid fa-lock"
                                title="No payment methods available"
                                description="This customer prototype does not store cards or process payments."
                            />
                        </section>

                        <section className="account-panel" id="preferences-security" aria-labelledby="preferences-security-title">
                            <div className="account-panel-heading">
                                <div>
                                    <span className="account-panel-kicker">ACCOUNT CONTROLS</span>
                                    <h2 id="preferences-security-title">Preferences &amp; Security</h2>
                                    <p>These controls will become available when their account services are integrated.</p>
                                </div>
                                <span className="account-panel-icon"><i className="fa-solid fa-sliders" aria-hidden="true"></i></span>
                            </div>
                            <div className="account-setting-list">
                                <SettingRow
                                    icon="fa-regular fa-bell"
                                    title="Notifications"
                                    description="Job updates and account alerts"
                                    status="Not connected"
                                />
                                <SettingRow
                                    icon="fa-solid fa-shield-halved"
                                    title="Security &amp; sign-in"
                                    description="Password, verification and active sessions"
                                    status="Not connected"
                                />
                                <SettingRow
                                    icon="fa-solid fa-user-shield"
                                    title="Emergency contact"
                                    description="Contact details for urgent service situations"
                                    status="Not connected"
                                />
                            </div>
                        </section>

                        <section className="account-panel" id="support-trust" aria-labelledby="support-trust-title">
                            <div className="account-panel-heading">
                                <div>
                                    <span className="account-panel-kicker">HELP CENTRE</span>
                                    <h2 id="support-trust-title">Support &amp; Trust</h2>
                                    <p>Information about customer support and platform policies.</p>
                                </div>
                                <span className="account-panel-icon"><i className="fa-regular fa-circle-question" aria-hidden="true"></i></span>
                            </div>
                            <div className="account-setting-list">
                                <SettingRow
                                    icon="fa-regular fa-life-ring"
                                    title="Help &amp; support"
                                    description="Support options are not connected in this prototype."
                                    status="Coming later"
                                />
                                <SettingRow
                                    icon="fa-solid fa-file-shield"
                                    title="Privacy &amp; terms"
                                    description="Policy links will be added when the approved customer URLs are available."
                                    status="Coming later"
                                />
                            </div>
                        </section>

                        <footer className="account-footer">
                            <span>FixIt Customer</span>
                            <span>Account settings</span>
                        </footer>
                    </div>
                </div>

                {feedback && (
                    <div className="account-feedback" role="status" aria-live="polite">
                        <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                        <span>{feedback}</span>
                        <button type="button" aria-label="Dismiss message" onClick={() => setFeedback('')}>
                            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

function EmptySettingState({ icon, title, description }) {
    return (
        <div className="account-empty-state">
            <span className="account-empty-icon"><i className={icon} aria-hidden="true"></i></span>
            <div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

function SettingRow({ icon, title, description, status }) {
    return (
        <div className="account-setting-row">
            <span className="account-setting-icon"><i className={icon} aria-hidden="true"></i></span>
            <div className="account-setting-copy">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <span className="account-setting-status">{status}</span>
        </div>
    );
}

export default Account;
