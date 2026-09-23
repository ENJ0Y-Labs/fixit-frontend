// fixit-customer\src\jobdetails\JobDetailsPageProps.jsx
import JobPhoto from "./JobPhoto";
import ProgressStep from "./ProgressStep";
import ProviderData from "./ProviderData";

function JobDetailsPageProps({
    category = "Unknown",
    status = "Unknown",
    title = "Unknown",
    description = "",

    dateandtimestr = "Sun, 1 Jan, 2000 • 12:00 AM",
    serviceLocation = "Unknown",
    fulladdress = "",
    urgency = "Normal",

    photos = [],

    provider = { "name": "John Doe", "title": "Unspecified", "avatarurl": "", "rating": 0, "reviewcount": 0, "isonline": true },
    aggreedprice = 0.0,
    progresstimeline = [{ "icon": "fa-solid fa-spinner", "title": "Loading", "description": "" }]
}) {

    return (
        <>
            <div>
                <div className="job-details">
                    <div>
                        <div>{category}</div>
                        <div>{status}</div>
                    </div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <div>
                        <div>
                            <div>
                                <i className="fa-solid fa-calendar"></i>
                            </div>
                            <div>
                                <p>DATE & TIME</p>
                                <p>{dateandtimestr}</p>
                            </div>
                        </div>
                        <div>
                            <div>
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div>
                                <p>SERVICE LOCATION</p>
                                <p>{serviceLocation}</p>
                            </div>
                        </div>
                        <div>
                            <div>
                                <i className="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <p>URGENCY</p>
                                <p>{urgency}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="job-photos">
                    <div>
                        <h2>Job Photos</h2>
                        <p>+ Add More</p>
                    </div>
                    <div>
                        <JobPhoto photos={photos} />
                    </div>
                </div>
                <div className="job-progress">
                    <h2>Job Progress</h2>
                    <div>
                        {
                            progresstimeline.map((progress) => (
                                <ProgressStep icon={progress.icon} title={progress.title} description={progress.description} timestamp={progress.timestamp} />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div>
                <div className="assigned-provider">
                    <ProviderData name={provider.name} title={provider.title} avatarurl={provider.avatarurl} rating={provider.rating} reviewcount={provider.reviewcount} isonline={provider.isonline} />
                </div>
                <div className="payment-overview">
                    <h2>PAYMENT OVERVIEW</h2>
                    <div>
                        <p>Agreed Price</p>
                        <p>N{aggreedprice}</p>
                    </div>
                    <div>
                        <i className="fa-solid fa-shield-halved"></i>
                        <p>Payment is held in secure escrow. Funds will be released only after you confirm completion.</p>
                    </div>
                    <button>Release Payment</button>
                    <p>Only click this after the job is finished and inspected.</p>
                </div>
                <div className="location-details">
                    <div>
                        <div>
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                    </div>
                    <div>
                        <i className="fa-solid fa-location-dot"></i>
                        <div>
                            <p>{serviceLocation}</p>
                            <p>{fulladdress}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default JobDetailsPageProps;