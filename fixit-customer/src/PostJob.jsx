import { useRef, useState } from 'react';

const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Painting'];

function PostJob() {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    function handleFileChange(event) {
        setSelectedFiles(Array.from(event.target.files ?? []).slice(0, 5));
    }

    return (
        <div className="post-job page-surface">
            <header className="page-header">
                <button type="button" className="back-button" aria-label="Go back">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1>Post a New Job</h1>
            </header>

            <main className="post-job-main">
                <form className="job-form" onSubmit={(event) => event.preventDefault()}>
                    <section className="form-section">
                        <div className="form-field">
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" id="job-title" placeholder="e.g. Fixing a leaking kitchen pipe" />
                        </div>
                        <div className="form-field">
                            <label htmlFor="service-category">Service Category</label>
                            <select name="service-category" id="service-category" defaultValue="">
                                <option value="">Select category</option>
                                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="detailed-description">Detailed Description</label>
                            <textarea name="detailed-description" id="detailed-description" placeholder="Describe what needs to be fixed..."></textarea>
                        </div>
                        <fieldset className="form-field urgency-field">
                            <legend>How urgent is this?</legend>
                            <label><input type="radio" name="urgency" value="normal" defaultChecked /> Normal</label>
                            <label><input type="radio" name="urgency" value="urgent" /> Urgent</label>
                            <label><input type="radio" name="urgency" value="asap" /> ASAP</label>
                        </fieldset>
                    </section>

                    <section className="form-section">
                        <div className="date-time-grid">
                            <div className="form-field">
                                <label htmlFor="preferred-date">Preferred Date</label>
                                <input type="date" name="preferred-date" id="preferred-date" />
                            </div>
                            <div className="form-field">
                                <label htmlFor="preferred-time">Preferred Time</label>
                                <input type="time" name="preferred-time" id="preferred-time" />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="service-location">Service Location</label>
                            <div className="input-with-icon">
                                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                                <input type="text" name="service-location" id="service-location" placeholder="Enter service address (Lagos/PH)" />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="job-photos">Photos (Optional)</label>
                            <label className="upload-box" htmlFor="job-photos">
                                <span className="upload-icon"><i className="fa-solid fa-cloud-arrow-up"></i></span>
                                <span className="upload-main">Click to upload</span>
                                <span className="upload-sub">Up to 5 photos • JPG, PNG</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="photos"
                                    id="job-photos"
                                    accept="image/jpeg,image/png"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </label>
                            {selectedFiles.length > 0 && (
                                <p className="file-count">{selectedFiles.length} photo{selectedFiles.length === 1 ? '' : 's'} selected.</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="estimated-budget">Estimated Budget (₦)</label>
                            <div className="budget-input">
                                <i className="fa-solid fa-naira-sign" aria-hidden="true"></i>
                                <input type="number" name="estimated-budget" id="estimated-budget" min="0" inputMode="numeric" placeholder="Enter amount" />
                            </div>
                            <div className="info-note">
                                <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                                <p>Setting a budget helps us find the right providers. Final price is negotiated after inspection.</p>
                            </div>
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="button" className="outline-button">Save as Draft</button>
                        <button type="submit" className="dark-button">Post This Job</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default PostJob;
