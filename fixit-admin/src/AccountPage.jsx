import { useState } from 'react';
import './AccountPage.css';

const emptyProfile = { displayName: '', email: '', phone: '' };

function AccountPage({ onNavigate }) {
    const [profile, setProfile] = useState(emptyProfile);
    const [savedProfile, setSavedProfile] = useState(emptyProfile);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    function updateField(event) {
        setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
        setFeedback('');
        setError('');
    }

    function saveProfile(event) {
        event.preventDefault();
        if (!profile.displayName.trim()) {
            setError('Enter a display name before applying your demo profile.');
            return;
        }
        if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
            setError('Enter a valid email address or leave the field empty.');
            return;
        }
        setSavedProfile(profile);
        setFeedback('Demo profile applied in this page only. Nothing has been sent to FixIt servers.');
        setError('');
    }

    function resetProfile() {
        setProfile(emptyProfile);
        setSavedProfile(emptyProfile);
        setFeedback('Demo profile fields have been cleared.');
        setError('');
    }

    return (
        <div className="account-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Demo account</strong> This page does not load an authenticated administrator profile. Profile edits are temporary browser state and are not saved to a server.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">System</p>
                    <h1>My account</h1>
                    <p className="page-description">Review the profile and access information for this admin workspace.</p>
                </div>
            </section>

            <div className="account-layout">
                <section className="panel account-profile-card" aria-labelledby="account-profile-heading">
                    <div className="account-card-heading">
                        <div className="account-avatar" aria-hidden="true">{(savedProfile.displayName || 'AD').trim().slice(0, 2).toUpperCase()}</div>
                        <div>
                            <h2 id="account-profile-heading">{savedProfile.displayName || 'Admin workspace'}</h2>
                            <p>{savedProfile.email || 'No email address configured'}</p>
                            <span className="account-role">Demo administrator</span>
                        </div>
                    </div>
                    <div className="account-profile-meta">
                        <div><span>Account type</span><strong>Demo workspace</strong></div>
                        <div><span>Phone number</span><strong>{savedProfile.phone || 'Not provided'}</strong></div>
                        <div><span>Account status</span><strong><span className="account-status">Not authenticated</span></strong></div>
                    </div>
                    <p className="account-help-text">A real account profile will be populated from the authenticated admin session when the backend integration is available.</p>
                </section>

                <section className="panel account-security-card" aria-labelledby="account-security-heading">
                    <div className="account-section-heading">
                        <div><h2 id="account-security-heading">Sign-in and security</h2><p>Authentication controls are not connected in this frontend demo.</p></div>
                        <span className="account-readonly">Unavailable</span>
                    </div>
                    <div className="account-security-row">
                        <span className="account-security-icon" aria-hidden="true">⌑</span>
                        <div><strong>Password</strong><small>Password changes are managed by the authentication service.</small></div>
                        <span className="account-security-state">Not connected</span>
                    </div>
                    <div className="account-security-row">
                        <span className="account-security-icon" aria-hidden="true">◷</span>
                        <div><strong>Active sessions</strong><small>No authenticated session information is available.</small></div>
                        <span className="account-security-state">Unavailable</span>
                    </div>
                    <div className="account-security-row">
                        <span className="account-security-icon" aria-hidden="true">✓</span>
                        <div><strong>Two-factor authentication</strong><small>Multi-factor authentication status is not provided.</small></div>
                        <span className="account-security-state">Unknown</span>
                    </div>
                    <p className="account-help-text">Do not treat this demo page as proof of account security. Password resets, session revocation, and MFA must be implemented and enforced by the authentication backend.</p>
                </section>
            </div>

            <form className="panel account-edit-card" onSubmit={saveProfile}>
                <div className="account-section-heading">
                    <div><h2>Edit profile</h2><p>Enter sample details to preview the profile form.</p></div>
                    <span className="account-readonly">Demo only</span>
                </div>
                <div className="account-fields">
                    <label className="account-field" htmlFor="account-display-name">
                        <span>Display name <b aria-hidden="true">*</b></span>
                        <input id="account-display-name" name="displayName" autoComplete="name" value={profile.displayName} onChange={updateField} placeholder="Enter display name" required />
                    </label>
                    <label className="account-field" htmlFor="account-email">
                        <span>Email address</span>
                        <input id="account-email" name="email" type="email" autoComplete="email" value={profile.email} onChange={updateField} placeholder="admin@example.com" />
                    </label>
                    <label className="account-field" htmlFor="account-phone">
                        <span>Phone number</span>
                        <input id="account-phone" name="phone" type="tel" autoComplete="tel" value={profile.phone} onChange={updateField} placeholder="+234 800 000 0000" />
                    </label>
                </div>
                {error && <p className="account-feedback is-error" role="alert">{error}</p>}
                {feedback && <p className="account-feedback" role="status">{feedback}</p>}
                <div className="account-form-actions">
                    <button className="account-secondary-button" type="button" onClick={resetProfile}>Clear demo profile</button>
                    <button className="account-primary-button" type="submit">Apply demo profile</button>
                </div>
            </form>

            <section className="account-settings-link panel">
                <div><h2>Workspace preferences</h2><p>Notification and display preferences are managed separately.</p></div>
                <button type="button" className="account-secondary-button" onClick={() => onNavigate('Settings')}>Open settings <span aria-hidden="true">↗</span></button>
            </section>
        </div>
    );
}

export default AccountPage;
