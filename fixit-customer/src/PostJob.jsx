// fixit-customer\src\PostJob.jsx
import { useRef } from "react";

function PostJob() {

    const categories = ["Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting"];

    const fileInputRef = useRef(null);

    function handleDropZoneClick() {
        fileInputRef.current.click();
    }

    function handleFileChange(event) {
        const files = event.target.files;
        console.log(files);
    }

    return (
        <div className="post-job">
            <header>
                <i className="fa-solid fa-arrow-left"></i>
                <h2>Post a New Job</h2>
            </header>
            <main>
                <div className="job-form">
                    <div className="form-section">
                        <div>
                            <label htmlFor="job-title"></label>
                            <input type="text" name="job-title" id="" placeholder="e.g. Fixing a leaking kitchen pipe" />
                        </div>
                        <div>
                            <label htmlFor="service-category">Service Cartegory</label>
                            <select name="service-category" id="">
                                <option value="">Select category</option>
                                {
                                    categories.map((category) => (
                                        <option value={category}>{category}</option>
                                    ))
                                }
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="detailed-description">Detailed Description</label>
                            <textarea name="detailed-description" id=""></textarea>
                        </div>
                        <div>
                            <label htmlFor="">How urgent is this?</label>
                            <div className="urgency-row">
                                <input type="radio" name="urgent" id="normal" defaultChecked />
                                <label htmlFor="normal">Normal</label>

                                <input type="radio" name="urgent" id="urgent" />
                                <label htmlFor="urgent">Urgent</label>

                                <input type="radio" name="urgent" id="asap" />
                                <label htmlFor="asap">ASAP</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <div>
                            <div>
                                <label htmlFor="preferred-date">Preferred Date</label>
                                <input type="date" name="preferred-date" id="" />
                            </div>
                            <div>
                                <label htmlFor="preferred-time">Preferred Time</label>
                                <input type="time" name="preferred-time" id="" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="service-location">Service Location</label>
                            <div>
                                <i className="fa-solid fa-location-dot"></i>
                                <input type="text" name="service-location" id="" placeholder="Enter service address (Lagos/PH)" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="photos">Photos (Optional)</label>
                            <div className="upload-box" onClick={handleDropZoneClick}>
                                <div>
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                </div>

                                <p className="main-text">Click to upload</p>
                                <p className="sub-text">Up to 5 photos • JPG, PNG</p>

                                <input type="file" id="hiddenFileInput" accept=".jpg, .jpeg, .png" multiple ref={fileInputRef} onChange={handleFileChange} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="estimated-budget">Estimated Budget (₦)</label>
                            <div>
                                <i className="fa-solid fa-naira-sign"></i>
                                <input type="text" name="estimated-budget" id="" placeholder="Enter amount" />
                                <div>
                                    <i className="fa-solid fa-circle-info"></i>
                                    <p>Setting a budget helps us find the right providers for you.Final price is negotiated after the provider inspects the job.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div>
                    <button>Save as Draft</button>
                    <button>Post This Job</button>
                </div>
            </main>
        </div>
    );
}

export default PostJob;