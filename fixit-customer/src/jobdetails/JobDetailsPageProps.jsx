import JobPhoto from './JobPhoto';
import ProgressStep from './ProgressStep';
import ProviderData from './ProviderData';

const defaultProvider = {
    name: 'John Doe',
    title: 'Unspecified',
    avatarurl: '',
    rating: 0,
    reviewcount: 0,
    isonline: false,
};

function JobDetailsPageProps({
    category = 'PLUMBING',
    status = 'IN PROGRESS',
    title = 'Fixing Kitchen Sink Leak',
    description = 'The kitchen sink is leaking from the pipe underneath and needs to be repaired.',
    dateandtimestr = 'Sat, 21 Feb 2026 • 10:00 AM',
    serviceLocation = 'Victoria Island, Lagos',
    fulladdress = '14 Adeola Odeku Street',
    urgency = 'Normal',
    photos = [],
    provider = defaultProvider,
    providerName = 'Emeka Nwachukwu',
    agreedprice = 12500,
    onPayment,
    onMessages,
    progresstimeline = [
        { icon: 'fa-solid fa-check', title: 'Job posted', description: 'Your job was posted successfully.', timestamp: '9:00 AM' },
        { icon: 'fa-solid fa-user-check', title: 'Provider assigned', description: 'Emeka Nwachukwu accepted the job.', timestamp: '9:30 AM' },
        { icon: 'fa-solid fa-spinner', title: 'Work in progress', description: 'The provider is currently working on the issue.', timestamp: 'Now' },
    ],
}) {
    return (
        <>
            <div className="job-details-left">
                <section className="job-summary-card">
                    <div className="job-summary-badges">
                        <span>{category}</span>
                        <span>{status}</span>
                    </div>
                    <h2>{title}</h2>
                    <p className="job-description">{description}</p>

                    <div className="job-facts">
                        <Fact icon="fa-solid fa-calendar" label="DATE & TIME" value={dateandtimestr} />
                        <Fact icon="fa-solid fa-location-dot" label="SERVICE LOCATION" value={serviceLocation} />
                        <Fact icon="fa-solid fa-bolt" label="URGENCY" value={urgency} />
                    </div>
                </section>

                <section className="job-photos-card">
                    <div className="section-heading">
                        <h2>Job Photos</h2>
                        <button type="button">+ Add More</button>
                    </div>
                    <JobPhoto photos={photos} />
                </section>

                <section className="job-progress-card">
                    <h2>Job Progress</h2>
                    <div className="progress-list">
                        {progresstimeline.map((progress, index) => (
                            <ProgressStep
                                key={`${progress.title}-${index}`}
                                icon={progress.icon}
                                title={progress.title}
                                description={progress.description}
                                timestamp={progress.timestamp}
                            />
                        ))}
                    </div>
                </section>
            </div>

            <aside className="job-details-right">
                <section className="assigned-provider-card">
                    <ProviderData {...provider} name={providerName} onMessages={onMessages} />
                </section>

                <section className="payment-overview-card">
                    <h2>PAYMENT OVERVIEW</h2>
                    <div className="payment-amount-row">
                        <span>Agreed Price</span>
                        <strong>₦{agreedprice.toLocaleString('en-NG')}</strong>
                    </div>
                    <div className="escrow-note">
                        <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                        <p>Payment is held in secure escrow. Funds will be released only after you confirm completion.</p>
                    </div>
                    <button type="button" className="dark-button full-width" onClick={onPayment} disabled={status === 'CANCELLED' || status === 'AWAITING BIDS'}>Release Payment</button>
                    <p className="warning-text">Only click this after the job is finished and inspected.</p>
                </section>

                <section className="location-details-card">
                    <div className="map-placeholder">
                        <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                    </div>
                    <div className="location-copy">
                        <div className="location-icon"><i className="fa-solid fa-location-dot"></i></div>
                        <div>
                            <h2>{serviceLocation}</h2>
                            <p>{fulladdress}</p>
                        </div>
                    </div>
                </section>
            </aside>
        </>
    );
}

function Fact({ icon, label, value }) {
    return (
        <div className="job-fact">
            <div className="fact-icon"><i className={icon}></i></div>
            <div>
                <p>{label}</p>
                <strong>{value}</strong>
            </div>
        </div>
    );
}

export default JobDetailsPageProps;
