import { useEffect, useState } from 'react';
import './CommunicationAccountPages.css';

const defaults = { emailNotifications: true, messageNotifications: true, jobNotifications: true, marketingEmails: false, language: 'en-NG' };
const normalise = (settings) => ({ ...defaults, ...settings });

export default function SettingsPage({ persistedSettings, onSaveSettings }) {
    const [draft, setDraft] = useState(() => normalise(persistedSettings || defaults));
    const [saved, setSaved] = useState(() => normalise(persistedSettings || defaults));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const configured = persistedSettings != null;
    const dirty = Object.keys(saved).some((key) => draft[key] !== saved[key]);

    useEffect(() => {
        if (persistedSettings == null) return;
        const next = normalise(persistedSettings);
        setDraft(next); setSaved(next); setError(''); setNotice('');
    }, [persistedSettings]);

    function update(key, value) { setDraft((current) => ({ ...current, [key]: value })); setNotice(''); }
    function reset() { setDraft({ ...saved }); setError(''); setNotice(''); }

    async function save(event) {
        event.preventDefault();
        if (!dirty || saving || typeof onSaveSettings !== 'function') return;
        setSaving(true); setError(''); setNotice('');
        try {
            const result = await onSaveSettings({ ...draft });
            if (!result || result.saved !== true || !result.settings) {
                setError('The server did not confirm saved settings. Your changes remain unsaved.');
                return;
            }
            const next = normalise(result.settings);
            setSaved(next); setDraft(next); setNotice('Settings saved and confirmed by the server.');
        } catch (saveError) { setError(saveError?.message || 'Settings could not be saved. Your changes remain unsaved.'); }
        finally { setSaving(false); }
    }

    return <div className="communication-page"><div className="page-heading"><div><p className="eyebrow">Account preferences</p><h1>Settings</h1><p>Change notification preferences and save them only when the server confirms persistence.</p></div></div>
        {!configured && <section className="card comm-unavailable" role="status"><h2>Saved preferences are not connected</h2><p>The controls below are a local draft only. They are not loaded from or saved to your account until the settings API is connected.</p></section>}
        {error && <p className="comm-alert" role="alert">{error}</p>}{notice && <p className="comm-notice" role="status">{notice}</p>}
        <form className="card settings-form" onSubmit={save}><div className="card-header"><div><h2>Notifications</h2><p>These choices affect your account only after a confirmed save.</p></div><span className={dirty ? 'status-badge status-warning' : 'status-badge status-neutral'}>{dirty ? 'Unsaved changes' : configured ? 'Matches saved settings' : 'Local draft'}</span></div>
            {[
                ['emailNotifications', 'Email notifications', 'Receive important account and job updates by email.'],
                ['messageNotifications', 'New message alerts', 'Get notified when a customer sends a message.'],
                ['jobNotifications', 'Job opportunity alerts', 'Receive alerts for relevant job opportunities.'],
                ['marketingEmails', 'Product updates', 'Receive occasional product news and announcements.'],
            ].map(([key, label, description]) => <label className="settings-toggle" key={key}><span><strong>{label}</strong><small>{description}</small></span><input type="checkbox" checked={Boolean(draft[key])} onChange={(event) => update(key, event.target.checked)} /></label>)}
            <label className="form-field settings-language"><span>Language and number format</span><select value={draft.language} onChange={(event) => update('language', event.target.value)}><option value="en-NG">English (Nigeria)</option></select><small className="field-hint">Only options currently supported by this interface are listed.</small></label>
            <div className="dialog-footer settings-actions"><button className="btn btn-secondary" type="button" onClick={reset} disabled={!dirty || saving}>Discard changes</button><button className="btn btn-primary" type="submit" disabled={!dirty || saving || typeof onSaveSettings !== 'function'}>{saving ? 'Saving…' : 'Save settings'}</button></div>
            {typeof onSaveSettings !== 'function' && <p className="field-hint">Saving is disabled until a backend persistence callback is connected.</p>}
        </form>
        <section className="card comm-unavailable"><h2>Account and security</h2><p>Password changes, account deletion, and security-session management are not implemented in this frontend phase.</p></section>
    </div>;
}
