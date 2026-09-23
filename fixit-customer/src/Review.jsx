// fixit-customer\src\Review.jsx

function Review() {

    return (
        <div className="review">
            <div className="provider-details">
                <div>
                    <img src="" alt="profile picture" />
                </div>
                <div>
                    <h2>Emeka Nwachukwu</h2>
                    <p>Professional Plumber</p>
                </div>
                <div>
                    <div>
                        <p>SERVICE PROVIDED</p>
                        <p>Fixing Kitchen Sink Leak</p>
                    </div>
                    <div>
                        <p>SERVICE RATE</p>
                        <p>Sat, 21 Feb 2026</p>
                    </div>
                    <div>
                        <p>TOTAL PAID</p>
                        <p>N12,500</p>
                    </div>
                </div>
                <p>Reviews help our community grow safely and fairly.</p>
            </div>
            <div className="review-content">
                <header>
                    <h2>Write a Review</h2>
                    <i className="fa-solid fa-xmark"></i>
                </header>
                <p>RATE YOUR OVERALL EXPERIENCE</p>
                <div>
                    <div>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <hr />
                    <div>
                        <p>Good</p>
                        <p>4.0 out of 5.0</p>
                    </div>
                </div>
                <div>
                    <p>SHARE MORE DETAILS</p>
                    <textarea name="" id="" placeholder="
                        Was the provider punctual? Did they have the right tools? How satisfied are you with the quality of work?"></textarea>
                </div>
                <div>
                    <div>
                        <p>ADD PHOTOS (OPTIONAL)</p>
                        <p>Up to 4 photos</p>
                    </div>
                    <div className="upload-box">
                        <i class="fa-solid fa-camera"></i>
                        <p>Upload</p>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <hr />
                <div>
                    <div>
                        <input type="checkbox" name="anonymous" id="" />
                        <label htmlFor="anonymous">Post anonymously</label>
                    </div>
                    <button>Cancel</button>
                    <button>Submit Review</button>
                </div>
            </div>
        </div>
    );
}

export default Review;