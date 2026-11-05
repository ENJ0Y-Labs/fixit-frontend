import { useState } from 'react';
import './SettingsPage.css';

const initialPreferences = {
    emailAlerts: true,
    verificationAlerts: true,
    disputeAlerts: true,
    weeklySummary: false,
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    compactTables: false,
};

function PreferenceToggle({ id, label, description, checked, onChange }) {
    return (
        <label className="settings-toggle" htmlFor={id}>
            <span className="settings-toggle-copy">
                <strong>{label}</strong>
                <small>{description}</small>
            </span>
            <input id={id} type="checkbox" checked={checked} onChange={onChange} />
            <span className="settings-switch" aria-hidden="true" />
        </label>
    );
}

function SettingsPage() {
    const [preferences, setPreferences] = useState(initialPreferences);
    const [feedback, setFeedback] = useState('');

    function updatePreference(key, value) {
        setPreferences((current) => ({ ...current, [key]: value }));
        setFeedback('');
    }

    function savePreferences(event) {
        event.preventDefault();
        setFeedback('Demo preferences applied in this page only. They have not been saved to FixIt servers.');
    }

    function resetPreferences() {
        setPreferences(initialPreferences);
        setFeedback('Demo preferences have been reset to their defaults.');
    }

    return (
        <div className="settings-page">
            <div className="demo-notice" role="note">
                <span className="demo-notice-icon" aria-hidden="true">i</span>
                <p><strong>Demo settings</strong> Changes on this page affect only temporary browser state. No production account or platform configuration is changed.</p>
            </div>

            <section className="page-heading">
                <div>
                    <p className="eyebrow">System</p>
                    <h1>Settings</h1>
                    <p className="page-description">Manage the preferences for this admin workspace.</p>
                </div>
            </section>

            <section className="settings-section panel" aria-labelledby="admin-profile-heading">
                <div className="settings-section-heading">
                    <div><h2 id="admin-profile-heading">Admin profile</h2><p>Demo identity currently shown in the admin interface.</p></div>
                    <span className="settings-readonly">Read only</span>
                </div>
                <div className="settings-profile-grid">
                    <div><span>Display name</span><strong>Admin workspace</strong></div>
                    <div><span>Account email</span><strong>Not configured</strong></div>
                    <div><span>Account role</span><strong>Demo administrator</strong></div>
                    <div><span>Account status</span><strong><span className="settings-status">Demo session</span></strong></div>
                </div>
                <p className="settings-inline-note">Real profile editing, account security, password changes, and role management require authenticated backend support.</p>
            </section>

            <form className="settings-form" onSubmit={savePreferences}>
                <section className="settings-section panel" aria-labelledby="notifications-heading">
                    <div className="settings-section-heading">
                        <div><h2 id="notifications-heading">Notification preferences</h2><p>Choose which demo alerts this workspace should display as enabled.</p></div>
                    </div>
                    <div className="settings-toggle-list">
                        <PreferenceToggle id="email-alerts" label="Email notifications" description="General admin email alerts." checked={preferences.emailAlerts} onChange={(event) => updatePreference('emailAlerts', event.target.checked)} />
                        <PreferenceToggle id="verification-alerts" label="Provider verification" description="Alerts for provider applications awaiting review." checked={preferences.verificationAlerts} onChange={(event) => updatePreference('verificationAlerts', event.target.checked)} />
                        <PreferenceToggle id="dispute-alerts" label="Disputes and support" description="Alerts for new or updated support cases." checked={preferences.disputeAlerts} onChange={(event) => updatePreference('disputeAlerts', event.target.checked)} />
                        <PreferenceToggle id="weekly-summary" label="Weekly activity summary" description="A weekly overview of marketplace activity." checked={preferences.weeklySummary} onChange={(event) => updatePreference('weeklySummary', event.target.checked)} />
                    </div>
                </section>

                <section className="settings-section panel" aria-labelledby="display-heading">
                    <div className="settings-section-heading">
                        <div><h2 id="display-heading">Regional and display preferences</h2><p>Formatting options for this demo workspace.</p></div>
                    </div>
                    <div className="settings-fields">
                        <label className="settings-field" htmlFor="timezone">
                            <span>Time zone</span>
                            <select id="timezone" value={preferences.timezone} onChange={(event) => updatePreference('timezone', event.target.value)}>
                                <option value="Africa/Lagos">West Africa Time (Africa/Lagos)</option>
                                <option value="UTC">Coordinated Universal Time (UTC)</option>
                            </select>
                            <small>Changing this selection does not convert timestamps supplied by a backend.</small>
                        </label>
                        <label className="settings-field" htmlFor="date-format">
                            <span>Date format</span>
                            <select id="date-format" value={preferences.dateFormat} onChange={(event) => updatePreference('dateFormat', event.target.value)}>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                            <small>Preview preference only; existing page dates are unchanged.</small>
                        </label>
                    </div>
                    <PreferenceToggle id="compact-tables" label="Compact tables" description="Preference placeholder for denser table layouts." checked={preferences.compactTables} onChange={(event) => updatePreference('compactTables', event.target.checked)} />
                </section>

                <section className="settings-section panel" aria-labelledby="platform-info-heading">
                    <div className="settings-section-heading">
                        <div><h2 id="platform-info-heading">Platform information</h2><p>Read-only details about this frontend environment.</p></div>
                        <span className="settings-readonly">Read only</span>
                    </div>
                    <div className="settings-profile-grid">
                        <div><span>Application</span><strong>FixIt Admin</strong></div>
                        <div><span>Environment</span><strong>Demo</strong></div>
                        <div><span>Data source</span><strong>Illustrative sample data</strong></div>
                        <div><span>Backend connection</span><strong>Not configured</strong></div>
                    </div>
                </section>

                <div className="settings-actions">
                    <button className="settings-secondary-button" type="button" onClick={resetPreferences}>Reset demo preferences</button>
                    <button className="settings-primary-button" type="submit">Apply demo preferences</button>
                </div>
                {feedback && <p className="settings-feedback" role="status">{feedback}</p>}
            </form>
        </div>
    );
}

export default SettingsPage;
