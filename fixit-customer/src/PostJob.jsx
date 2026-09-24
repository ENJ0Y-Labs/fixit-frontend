// fixit-customer\src\PostJob.jsx
import { useRef } from "react";

function PostJob() {

    const categories = ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting"];

    const fileInputRef = useRef(null);

    function handleDropZoneClick() {
        fileInputRef.current.click();
    }

    function handleDropZoneKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleDropZoneClick();
        }
    }

    function handleFileChange(event) {
        const files = event.target.files;
        console.log(files);
    }

    return (
        <div className="post-job">
            <header>
                <button type="button" className="plain-button" aria-label="Go back">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2>Post a New Job</h2>
            </header>
            <main>
                <div className="job-form">
                    <div className="form-section">
                        <div>
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" id="job-title" placeholder="e.g. Fixing a leaking kitchen pipe" />
                        </div>
                        <div>
                            <label htmlFor="service-category">Service Category</label>
                            <select name="service-category" id="service-category">
                                <option value="">Select category</option>
                                {
                                    categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))
                                }
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="detailed-description">Detailed Description</label>
                            <textarea name="detailed-description" id="detailed-description"></textarea>
                        </div>
                        <div>
                            <label id="urgency-label">How urgent is this?</label>
                            <div className="urgency-row" role="radiogroup" aria-labelledby="urgency-label">
                                <input type="radio" name="urgency" id="urgency-normal" value="normal" defaultChecked />
                                <label htmlFor="urgency-normal">Normal</label>

                                <input type="radio" name="urgency" id="urgency-urgent" value="urgent" />
                                <label htmlFor="urgency-urgent">Urgent</label>

                                <input type="radio" name="urgency" id="urgency-asap" value="asap" />
                                <label htmlFor="urgency-asap">ASAP</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <div>
                            <div>
                                <label htmlFor="preferred-date">Preferred Date</label>
                                <input type="date" name="preferred-date" id="preferred-date" />
                            </div>
                            <div>
                                <label htmlFor="preferred-time">Preferred Time</label>
                                <input type="time" name="preferred-time" id="preferred-time" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="service-location">Service Location</label>
                            <div>
                                <i className="fa-solid fa-location-dot"></i>
                                <input type="text" name="service-location" id="service-location" placeholder="Enter service address (Lagos/PH)" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="hiddenFileInput">Photos (Optional)</label>
                            <div className="upload-box" role="button" tabIndex={0} onClick={handleDropZoneClick} onKeyDown={handleDropZoneKeyDown}>
                                <div>
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                </div>

                                <p className="main-text">Click to upload</p>
                                <p className="sub-text">Up to 5 photos • JPG, PNG</p>

                                <input type="file" name="photos" id="hiddenFileInput" accept=".jpg, .jpeg, .png" multiple ref={fileInputRef} onChange={handleFileChange} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="estimated-budget">Estimated Budget (₦)</label>
                            <div>
                                <i className="fa-solid fa-naira-sign"></i>
                                <input type="text" name="estimated-budget" id="estimated-budget" inputMode="numeric" placeholder="Enter amount" />
                                <div>
                                    <i className="fa-solid fa-circle-info"></i>
                                    <p>Setting a budget helps us find the right providers for you. Final price is negotiated after the provider inspects the job.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div>
                    <button type="button">Save as Draft</button>
                    <button type="button">Post This Job</button>
                </div>
            </main>
        </div>
    );
}

export default PostJob;
