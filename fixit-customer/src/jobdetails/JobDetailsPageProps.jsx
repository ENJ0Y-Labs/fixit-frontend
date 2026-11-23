import { useEffect, useRef, useState } from 'react';
import JobPhoto from './JobPhoto';
import ProgressStep from './ProgressStep';
import ProviderData from './ProviderData';

function JobDetailsPageProps({
    category,
    status,
    title,
    description,
    dateandtimestr,
    serviceLocation,
    fulladdress,
    urgency,
    photos = [],
    provider,
    providerName,
    agreedprice,
    priceSubtext,
    paymentId,
    onPayment,
    progresstimeline = [],
}) {
    const photoInputRef = useRef(null);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const addedPhotosRef = useRef([]);
    useEffect(() => () => addedPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo)), []);
    const visiblePhotoCount = Math.min(4, photos.length + addedPhotos.length);
    const handleAddPhotos = (event) => {
        const remaining = Math.max(0, 4 - visiblePhotoCount);
        const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith('image/')).slice(0, remaining);
        const nextPhotos = files.map((file) => URL.createObjectURL(file));
        addedPhotosRef.current.push(...nextPhotos);
        setAddedPhotos((current) => [...current, ...nextPhotos]);
        event.target.value = '';
    };
    const hasPaymentAmount = agreedprice !== null && agreedprice !== undefined && Number.isFinite(Number(agreedprice));
    const amountLabel = hasPaymentAmount ? '₦' + Number(agreedprice).toLocaleString('en-NG') : 'Not provided';

    return (
        <>
            <div className="job-details-left">
                <section className="job-summary-card">
                    <div className="job-summary-badges"><span>{category || 'Category unavailable'}</span><span>{status || 'Status unavailable'}</span></div>
                    <h2>{title || 'Untitled job'}</h2>
                    {description && <p className="job-description">{description}</p>}
                    <div className="job-facts">
                        <Fact icon="fa-solid fa-calendar" label="DATE & TIME" value={dateandtimestr || 'Not scheduled'} />
                        <Fact icon="fa-solid fa-location-dot" label="SERVICE LOCATION" value={serviceLocation || 'Not provided'} />
                        <Fact icon="fa-solid fa-bolt" label="URGENCY" value={urgency || 'Not specified'} />
                    </div>
                </section>

                <section className="job-photos-card">
                    <div className="section-heading">
                        <h2>Job Photos</h2>
                        <button type="button" onClick={() => photoInputRef.current?.click()} disabled={visiblePhotoCount >= 4} aria-label="Add more job photos">+ Add More</button>
                        <input ref={photoInputRef} className="job-photo-upload-input" type="file" accept="image/*" multiple onChange={handleAddPhotos} aria-label="Choose job photos" />
                    </div>
                    <p className="photo-upload-note" role="status">{addedPhotos.length ? addedPhotos.length + ' photo(s) added for this session only.' : photos.length ? 'Photos attached to this job.' : 'No photos were attached to this job. New photo previews are only stored for this session.'}</p>
                    <JobPhoto photos={[...photos, ...addedPhotos]} onAddPhoto={() => photoInputRef.current?.click()} />
                </section>

                <section className="job-progress-card">
                    <h2>Job Progress</h2>
                    {progresstimeline.length ? <div className="progress-list">{progresstimeline.map((progress, index) => <ProgressStep key={progress.id || progress.title || index} icon={progress.icon || 'fa-solid fa-circle'} title={progress.title || progress.status || 'Update'} description={progress.description || ''} timestamp={progress.timestamp || progress.createdAt || progress.created_at || ''} />)}</div> : <p className="job-detail-muted">No progress updates have been provided for this job yet.</p>}
                </section>
            </div>

            <aside className="job-details-right">
                <section className="assigned-provider-card">
                    {provider ? <ProviderData {...provider} name={providerName || provider.name} /> : <div className="provider-unassigned"><h2>Assigned Provider</h2><p>{status === 'AWAITING BIDS' ? 'No provider has been selected yet. Review incoming bids when they are available.' : 'Provider details have not been provided for this job.'}</p></div>}
                </section>

                <section className="payment-overview-card">
                    <h2>PAYMENT OVERVIEW</h2>
                    <div className="payment-amount-row"><span>{status === 'AWAITING BIDS' ? 'Estimated Budget' : 'Agreed Price'}</span><strong>{amountLabel}</strong></div>
                    {priceSubtext && <p className="job-payment-status">Payment status: {priceSubtext}</p>}
                    {paymentId || priceSubtext ? <><button type="button" className="dark-button full-width" onClick={onPayment} disabled={!onPayment || status === 'CANCELLED'}>View payment details</button><p className="warning-text">Payment status and processing are confirmed by the server.</p></> : <p className="job-detail-muted">No payment details have been provided for this job.</p>}
                </section>

                <section className="location-details-card">
                    <div className="map-placeholder"><i className="fa-solid fa-location-dot" aria-hidden="true"></i></div>
                    <div className="location-copy"><div className="location-icon"><i className="fa-solid fa-location-dot" aria-hidden="true"></i></div><div><h2>{serviceLocation || 'Service location unavailable'}</h2><p>{fulladdress || 'No street address provided'}</p></div></div>
                </section>
            </aside>
        </>
    );
}

function Fact({ icon, label, value }) {
    return <div className="job-fact"><div className="fact-icon"><i className={icon} aria-hidden="true"></i></div><div><p>{label}</p><strong>{value}</strong></div></div>;
}

export default JobDetailsPageProps;
