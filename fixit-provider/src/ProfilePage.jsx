import { useEffect, useRef, useState } from 'react';
import './ProfilePage.css';

const initialProfile = {
    fullName: '',
    email: '',
    phone: '',
    biography: '',
    serviceArea: 'Port Harcourt',
    address: '',
    services: ['Plumbing'],
};

const serviceOptions = ['Plumbing', 'Electrical repairs', 'Cleaning', 'Carpentry', 'Painting', 'Air conditioning', 'Appliance repair', 'General maintenance'];
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxImageSize = 2 * 1024 * 1024;

function validateProfile(profile) {
    const errors = {};
    if (!profile.fullName.trim()) errors.fullName = 'Enter your full name.';
    if (!profile.email.trim()) errors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errors.email = 'Enter a valid email address.';
    if (!profile.phone.trim()) errors.phone = 'Enter your phone number.';
    else if (!/^(?:\+234|0)[789][01]\d{8}$/.test(profile.phone.replace(/[\s()-]/g, ''))) errors.phone = 'Use a valid Nigerian mobile number, e.g. 08012345678.';
    if (!profile.biography.trim()) errors.biography = 'Add a short professional biography.';
    else if (profile.biography.trim().length < 30) errors.biography = 'Write at least 30 characters so customers understand your experience.';
    if (!profile.serviceArea.trim()) errors.serviceArea = 'Enter your service area.';
    if (!profile.address.trim()) errors.address = 'Enter your base area or address.';
    if (profile.services.length === 0) errors.services = 'Choose at least one service.';
    return errors;
}

function FieldError({ id, children }) {
    return children ? <p className="profile-field-error" id={id} role="alert">{children}</p> : null;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState(initialProfile);
    const [savedProfile, setSavedProfile] = useState(initialProfile);
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState('');
    const [imageError, setImageError] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [notice, setNotice] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);
    const biographyRef = useRef(null);

    const isDirty = JSON.stringify(profile) !== JSON.stringify(savedProfile) || image !== '';
    const verificationStatus = 'Not submitted';

    useEffect(() => {
        if (!previewOpen) return undefined;
        function closeOnEscape(event) {
            if (event.key === 'Escape') setPreviewOpen(false);
        }
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [previewOpen]);

    function updateField(event) {
        const { name, value } = event.target;
        setProfile((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({ ...current, [name]: '' }));
        setNotice('');
    }

    function toggleService(service) {
        setProfile((current) => ({
            ...current,
            services: current.services.includes(service)
                ? current.services.filter((item) => item !== service)
                : [...current.services, service],
        }));
        setErrors((current) => ({ ...current, services: '' }));
        setNotice('');
    }

    function handleImageChange(event) {
        const file = event.target.files?.[0];
        setImageError('');
        setNotice('');
        if (!file) return;
        if (!allowedImageTypes.includes(file.type)) {
            setImageError('Choose a JPG, PNG, or WebP image.');
            event.target.value = '';
            return;
        }
        if (file.size > maxImageSize) {
            setImageError('Image must be 2 MB or smaller.');
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setImage(String(reader.result));
        reader.onerror = () => setImageError('The image could not be read. Try another file.');
        reader.readAsDataURL(file);
    }

    function openPreview(event) {
        event.preventDefault();
        const nextErrors = validateProfile(profile);
        setErrors(nextErrors);
        setNotice('');
        if (Object.keys(nextErrors).length > 0) {
            const firstField = Object.keys(nextErrors)[0];
            document.getElementById(`profile-${firstField}`)?.focus();
            return;
        }
        setPreviewOpen(true);
    }

    function saveProfile() {
        setIsSaving(true);
        // Frontend-only phase: show a local confirmation without pretending a backend saved anything.
        window.setTimeout(() => {
            setSavedProfile({ ...profile, services: [...profile.services] });
            setImage('');
            setPreviewOpen(false);
            setIsSaving(false);
            setNotice('Preview confirmed. This demo has no profile API, so changes have not been sent to a server.');
        }, 150);
    }

    function discardChanges() {
        if (!isDirty || window.confirm('Discard your unsaved profile changes?')) {
            setProfile({ ...savedProfile, services: [...savedProfile.services] });
            setImage('');
            setImageError('');
            setErrors({});
            setNotice('Unsaved changes discarded.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    return (
        <div className="profile-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Provider workspace</p>
                    <h1>Onboarding &amp; profile</h1>
                    <p>Help customers understand who you are, what you do, and where you work.</p>
                </div>
                <span className="status-badge status-neutral">Profile setup</span>
            </div>

            <section className="card verification-banner" aria-labelledby="verification-heading">
                <div className="verification-mark" aria-hidden="true">✓</div>
                <div>
                    <h2 id="verification-heading">Verification status</h2>
                    <p>Your identity and credentials have not been submitted for review.</p>
                </div>
                <span className="status-badge status-neutral">{verificationStatus}</span>
            </section>

            {notice && <p className="profile-notice" role="status">{notice}</p>}

            <form className="card profile-form" onSubmit={openPreview} noValidate>
                <div className="profile-section-heading">
                    <div>
                        <h2>Profile details</h2>
                        <p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
                    </div>
                    <span className={isDirty ? 'unsaved-indicator' : 'saved-indicator'}>{isDirty ? 'Unsaved changes' : 'No unsaved changes'}</span>
                </div>

                <div className="profile-photo-row">
                    <div className="profile-photo" aria-label="Profile photo preview">
                        {image ? <img src={image} alt="Selected profile preview" /> : <span aria-hidden="true">{profile.fullName.trim() ? profile.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() : 'NP'}</span>}
                    </div>
                    <div className="profile-photo-copy">
                        <strong>Profile photo</strong>
                        <p>JPG, PNG, or WebP. Maximum file size: 2 MB.</p>
                        <div className="profile-photo-actions">
                            <button className="btn btn-secondary" type="button" onClick={() => fileInputRef.current?.click()}>Choose image</button>
                            {image && <button className="btn btn-quiet" type="button" onClick={() => { setImage(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}>Remove</button>}
                        </div>
                        <input ref={fileInputRef} className="visually-hidden" id="profile-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} aria-describedby="profile-image-help profile-image-error" />
                        <span id="profile-image-help" className="text-muted profile-image-help">Image preview is local to this page.</span>
                        <FieldError id="profile-image-error">{imageError}</FieldError>
                    </div>
                </div>

                <div className="profile-fields-grid">
                    <div className="form-field">
                        <label htmlFor="profile-fullName">Full name <span aria-hidden="true">*</span></label>
                        <input id="profile-fullName" name="fullName" autoComplete="name" value={profile.fullName} onChange={updateField} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'error-fullName' : undefined} placeholder="e.g. Noble Ekwere" />
                        <FieldError id="error-fullName">{errors.fullName}</FieldError>
                    </div>
                    <div className="form-field">
                        <label htmlFor="profile-email">Email address <span aria-hidden="true">*</span></label>
                        <input id="profile-email" name="email" type="email" autoComplete="email" value={profile.email} onChange={updateField} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} placeholder="you@example.com" />
                        <FieldError id="error-email">{errors.email}</FieldError>
                    </div>
                    <div className="form-field">
                        <label htmlFor="profile-phone">Phone number <span aria-hidden="true">*</span></label>
                        <input id="profile-phone" name="phone" type="tel" autoComplete="tel" value={profile.phone} onChange={updateField} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'error-phone' : undefined} placeholder="08012345678" />
                        <FieldError id="error-phone">{errors.phone}</FieldError>
                    </div>
                    <div className="form-field">
                        <label htmlFor="profile-serviceArea">City or service area <span aria-hidden="true">*</span></label>
                        <input id="profile-serviceArea" name="serviceArea" value={profile.serviceArea} onChange={updateField} aria-invalid={Boolean(errors.serviceArea)} aria-describedby={errors.serviceArea ? 'error-serviceArea' : undefined} placeholder="e.g. Port Harcourt" />
                        <FieldError id="error-serviceArea">{errors.serviceArea}</FieldError>
                    </div>
                    <div className="form-field profile-field-full">
                        <label htmlFor="profile-address">Base area or address <span aria-hidden="true">*</span></label>
                        <input id="profile-address" name="address" autoComplete="street-address" value={profile.address} onChange={updateField} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'error-address' : undefined} placeholder="e.g. Rumuola, Port Harcourt" />
                        <FieldError id="error-address">{errors.address}</FieldError>
                    </div>
                    <div className="form-field profile-field-full">
                        <label htmlFor="profile-biography">Professional biography <span aria-hidden="true">*</span></label>
                        <textarea ref={biographyRef} id="profile-biography" name="biography" rows="5" maxLength="600" value={profile.biography} onChange={updateField} aria-invalid={Boolean(errors.biography)} aria-describedby={errors.biography ? 'error-biography biography-count' : 'biography-count'} placeholder="Describe your experience, how you work, and what customers can expect." />
                        <div className="profile-field-footer">
                            <FieldError id="error-biography">{errors.biography}</FieldError>
                            <span id="biography-count" className="text-muted">{profile.biography.length}/600</span>
                        </div>
                    </div>
                </div>

                <fieldset className="profile-services">
                    <legend>Services offered <span aria-hidden="true">*</span></legend>
                    <p className="text-muted">Select every service you currently offer.</p>
                    <div className="service-checkbox-grid">
                        {serviceOptions.map((service) => (
                            <label className="service-checkbox" key={service}>
                                <input type="checkbox" checked={profile.services.includes(service)} onChange={() => toggleService(service)} />
                                <span>{service}</span>
                            </label>
                        ))}
                    </div>
                    <FieldError id="error-services">{errors.services}</FieldError>
                </fieldset>

                <div className="profile-form-actions">
                    <button className="btn btn-secondary" type="button" onClick={discardChanges}>Discard changes</button>
                    <button className="btn btn-primary" type="submit">Preview profile <span aria-hidden="true">↗</span></button>
                </div>
                <p className="profile-demo-note">Frontend demo only. Profile edits are held in page state and are not sent to a server.</p>
            </form>

            {previewOpen && (
                <div className="profile-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false); }}>
                    <section className="profile-preview-modal" role="dialog" aria-modal="true" aria-labelledby="profile-preview-title">
                        <div className="profile-section-heading">
                            <div>
                                <p className="eyebrow">Before you continue</p>
                                <h2 id="profile-preview-title">Preview your profile</h2>
                                <p>This is how the details will be presented to customers.</p>
                            </div>
                            <button className="icon-button" type="button" aria-label="Close profile preview" onClick={() => setPreviewOpen(false)}>×</button>
                        </div>
                        <div className="profile-preview-card">
                            <div className="profile-preview-identity">
                                <div className="profile-photo profile-photo-large">{image ? <img src={image} alt="" /> : <span>{profile.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>}</div>
                                <div><h3>{profile.fullName}</h3><p>{profile.serviceArea}</p><span className="status-badge status-neutral">Not verified</span></div>
                            </div>
                            <h3>About</h3><p className="profile-preview-bio">{profile.biography}</p>
                            <h3>Services</h3><div className="profile-preview-tags">{profile.services.map((service) => <span key={service}>{service}</span>)}</div>
                            <h3>Contact details</h3><p>{profile.phone}</p><p>{profile.email}</p><p>{profile.address}</p>
                        </div>
                        <div className="profile-form-actions">
                            <button className="btn btn-secondary" type="button" onClick={() => setPreviewOpen(false)}>Back to editing</button>
                            <button className="btn btn-primary" type="button" onClick={saveProfile} disabled={isSaving}>{isSaving ? 'Confirming…' : 'Confirm preview'}</button>
                        </div>
                        <p className="profile-demo-note">Confirming only marks this local demo as reviewed. It does not publish or save your profile online.</p>
                    </section>
                </div>
            )}
        </div>
    );
}
