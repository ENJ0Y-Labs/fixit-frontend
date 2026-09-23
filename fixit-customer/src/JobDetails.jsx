// fixit-customer\src\JobDetails.jsx
import JobDetailsPageProps from "./jobdetails/JobDetailsPageProps";

function JobDetails() {

    return (
        <div className="job-details">
            <header>
                <div>
                    <i className="fa-solid fa-arrow-left"></i>
                    <h2>Job Details</h2>
                </div>
                <div>
                    <button>Cancel Job</button>
                    <button>Support</button>
                </div>
            </header>
            <main>
                <JobDetailsPageProps />
            </main>
        </div>
    );
}

export default JobDetails;