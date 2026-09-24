import './styles/pages/jobs.css';
import { useState } from 'react';
import avatarPlaceholder from './assets/avatar-placeholder.svg';

function Review({ job, onClose, onSubmit }) {
    const [selectedFiles, setSelectedFiles] = useState([]);

    function handleFileChange(event) {
        setSelectedFiles(Array.from(event.target.files ?? []).slice(0, 4));
    }

    return (
        <div className="review-overlay" role="dialog" aria-modal="true" aria-labelledby="review-title">
            <div className="review">
                <aside className="review-provider">
                    <div className="review-avatar">
                        <img src={avatarPlaceholder} alt="Provider" />
                    </div>
                    <div className="review-provider-copy">
                        <h2>{job?.provider || 'Emeka Nwachukwu'}</h2>
                        <p>Professional Plumber</p>
                    </div>
                    <div className="review-meta">
                        <div><span>SERVICE PROVIDED</span><strong>{job?.title || 'Fixing Kitchen Sink Leak'}</strong></div>
                        <div><span>SERVICE DATE</span><strong>Sat, 21 Feb 2026</strong></div>
                        <div><span>TOTAL PAID</span><strong>₦12,500</strong></div>
                    </div>
                    <p className="review-note">Reviews help our community grow safely and fairly.</p>
                </aside>

                <section className="review-content">
                    <header className="review-header">
                        <h1 id="review-title">Write a Review</h1>
                        <button type="button" className="plain-icon-button" aria-label="Close review" onClick={onClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </header>

                    <div className="review-section">
                        <p className="review-label">RATE YOUR OVERALL EXPERIENCE</p>
                        <div className="rating-row">
                            <div className="stars" aria-label="4 out of 5 stars">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-regular fa-star"></i>
                            </div>
                            <div className="rating-divider"></div>
                            <div>
                                <strong>Good</strong>
                                <span>4.0 out of 5.0</span>
                            </div>
                        </div>
                    </div>

                    <div className="review-section">
                        <label className="review-label" htmlFor="review-details">SHARE MORE DETAILS</label>
                        <textarea name="review-details" id="review-details" placeholder="Was the provider punctual? Did they have the right tools? How satisfied are you with the quality of work?"></textarea>
                    </div>

                    <div className="review-section photo-section">
                        <div className="photo-header">
                            <p className="review-label">ADD PHOTOS (OPTIONAL)</p>
                            <span>Up to 4 photos</span>
                        </div>
                        <div className="photo-row">
                            <label className="upload-box" htmlFor="review-photos">
                                <i className="fa-solid fa-camera"></i>
                                <span>Upload</span>
                                <input type="file" id="review-photos" accept="image/*" multiple onChange={handleFileChange} />
                            </label>
                            {[0, 1, 2].map((slot) => (
                                <div className={`photo-slot${selectedFiles[slot] ? ' has-file' : ''}`} key={slot}>
                                    {selectedFiles[slot] ? <span>{selectedFiles[slot].name}</span> : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="review-actions">
                        <label className="anonymous-option">
                            <input type="checkbox" name="anonymous" />
                            <span>Post anonymously</span>
                        </label>
                        <button type="button" className="outline-button" onClick={onClose}>Cancel</button>
                        <button type="button" className="dark-button" onClick={onSubmit}>Submit Review</button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Review;
