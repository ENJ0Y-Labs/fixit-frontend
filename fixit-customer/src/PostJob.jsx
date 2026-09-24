import './styles/pages/jobs.css';
import { useRef, useState } from 'react';

const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting'];

function PostJob({ onBack, onJobPosted }) {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [form, setForm] = useState({
        title: '',
        category: '',
        description: '',
        urgency: 'normal',
        date: '',
        time: '',
        location: '',
        budget: '',
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setSaved(false);
        setError('');
    };

    function handleFileChange(event) {
        setSelectedFiles(Array.from(event.target.files ?? []).slice(0, 5));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.title.trim() || !form.category || !form.location.trim() || !form.budget) {
            setError('Please complete the job title, category, location, and budget before posting.');
            return;
        }

        onJobPosted({
            ...form,
            title: form.title.trim(),
            location: form.location.trim(),
            budget: Number(form.budget),
            dateStr: form.date ? new Date(`${form.date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : 'Flexible date',
        });
    }

    return (
        <div className="post-job page-surface">
            <header className="page-header">
                <button type="button" className="back-button" aria-label="Go back" onClick={onBack}><i className="fa-solid fa-arrow-left"></i></button>
                <h1>Post a New Job</h1>
            </header>

            <main className="post-job-main">
                <form className="job-form" onSubmit={handleSubmit}>
                    <section className="form-section">
                        <div className="form-field">
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" id="job-title" value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="e.g. Fixing a leaking kitchen pipe" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="service-category">Service Category</label>
                            <select name="service-category" id="service-category" value={form.category} onChange={(event) => updateField('category', event.target.value)}>
                                <option value="">Select category</option>
                                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="detailed-description">Detailed Description</label>
                            <textarea name="detailed-description" id="detailed-description" value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Describe what needs to be fixed..."></textarea>
                        </div>
                        <fieldset className="form-field urgency-field">
                            <legend>How urgent is this?</legend>
                            {['normal', 'urgent', 'asap'].map((value) => (
                                <label key={value}><input type="radio" name="urgency" value={value} checked={form.urgency === value} onChange={(event) => updateField('urgency', event.target.value)} /> {value.toUpperCase()}</label>
                            ))}
                        </fieldset>
                    </section>

                    <section className="form-section">
                        <div className="date-time-grid">
                            <div className="form-field">
                                <label htmlFor="preferred-date">Preferred Date</label>
                                <input type="date" name="preferred-date" id="preferred-date" value={form.date} onChange={(event) => updateField('date', event.target.value)} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="preferred-time">Preferred Time</label>
                                <input type="time" name="preferred-time" id="preferred-time" value={form.time} onChange={(event) => updateField('time', event.target.value)} />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="service-location">Service Location</label>
                            <div className="input-with-icon">
                                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                                <input type="text" name="service-location" id="service-location" value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Enter service address (Lagos/PH)" />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="job-photos">Photos (Optional)</label>
                            <label className="upload-box" htmlFor="job-photos">
                                <span className="upload-icon"><i className="fa-solid fa-cloud-arrow-up"></i></span>
                                <span className="upload-main">Click to upload</span>
                                <span className="upload-sub">Up to 5 photos • JPG, PNG</span>
                                <input ref={fileInputRef} type="file" name="photos" id="job-photos" accept="image/jpeg,image/png" multiple onChange={handleFileChange} />
                            </label>
                            {selectedFiles.length > 0 && <p className="file-count">{selectedFiles.length} photo{selectedFiles.length === 1 ? '' : 's'} selected.</p>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="estimated-budget">Estimated Budget (₦)</label>
                            <div className="budget-input">
                                <i className="fa-solid fa-naira-sign" aria-hidden="true"></i>
                                <input type="number" name="estimated-budget" id="estimated-budget" min="0" inputMode="numeric" value={form.budget} onChange={(event) => updateField('budget', event.target.value)} placeholder="Enter amount" />
                            </div>
                            <div className="info-note"><i className="fa-solid fa-circle-info" aria-hidden="true"></i><p>Setting a budget helps us find the right providers. Final price is negotiated after inspection.</p></div>
                        </div>
                    </section>

                    {error && <p className="form-error" role="alert">{error}</p>}
                    {saved && <p className="form-success" role="status">Draft saved on this device.</p>}

                    <div className="form-actions">
                        <button type="button" className="outline-button" onClick={() => setSaved(true)}>Save as Draft</button>
                        <button type="submit" className="dark-button">Post This Job</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default PostJob;
