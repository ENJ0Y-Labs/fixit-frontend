import { useRef, useState } from 'react';
import './BidWorkflow.css';

const formatNaira = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
}).format(amount);

function statusLabel(status) {
    return String(status).replace(/[_-]+/g, ' ');
}

export function BidStatusList({ bids = [] }) {
    if (bids.length === 0) {
        return <p className="bid-empty-state">No submitted bid records are available for this job.</p>;
    }

    return (
        <ul className="bid-status-list" aria-label="Submitted bids">
            {bids.map((bid) => (
                <li className="bid-status-card" key={bid.id}>
                    <div className="bid-status-heading">
                        <strong>{formatNaira(bid.price)}</strong>
                        <span className="status-badge status-neutral" aria-label={`Bid status: ${bid.status}`}>
                            {statusLabel(bid.status)}
                        </span>
                    </div>
                    <p>{bid.message}</p>
                    {bid.proposedSchedule && <p className="bid-schedule">Proposed schedule: {bid.proposedSchedule}</p>}
                    {bid.createdAt && <p className="bid-created-at">Submitted {new Date(bid.createdAt).toLocaleString('en-NG')}</p>}
                </li>
            ))}
        </ul>
    );
}

/**
 * onSubmitBid must resolve with a server-confirmed bid containing a non-empty id
 * and the exact server-defined status. This component never fabricates success.
 */
export default function BidWorkflow({ job, onSubmitBid, submittedBids = [] }) {
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [schedule, setSchedule] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [confirmedBid, setConfirmedBid] = useState(null);
    const submitLock = useRef(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (submitLock.current) return;

        const numericPrice = Number(price);
        if (!price.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
            setError('Enter a valid price greater than ₦0.');
            return;
        }
        if (!message.trim()) {
            setError('Add a message explaining your quote.');
            return;
        }
        if (typeof onSubmitBid !== 'function') {
            setError('Bid submission is not connected to the backend yet. Your quote has not been sent.');
            return;
        }

        submitLock.current = true;
        setIsSubmitting(true);
        setError('');
        setConfirmedBid(null);

        try {
            const response = await onSubmitBid(job.id, {
                price: numericPrice,
                currency: 'NGN',
                message: message.trim(),
                ...(schedule ? { proposedSchedule: schedule } : {}),
            });

            const serverBid = response?.bid ?? response;
            if (!serverBid || typeof serverBid.id !== 'string' || !serverBid.id.trim()
                || typeof serverBid.status !== 'string' || !serverBid.status.trim()) {
                setError('The server response could not confirm this bid. Check your submitted bids before trying again.');
                return;
            }
            setConfirmedBid(serverBid);
        } catch (submissionError) {
            if (submissionError?.status === 409) {
                setError('This job is no longer available for bids. Refresh available jobs before continuing.');
            } else if (submissionError?.status === 401) {
                setError('Your session has expired. Sign in again before submitting a bid.');
            } else if (submissionError?.status === 403) {
                setError('You are not permitted to bid on this job.');
            } else {
                setError(submissionError?.message || 'We could not submit your bid. Your quote has been kept so you can retry.');
            }
        } finally {
            submitLock.current = false;
            setIsSubmitting(false);
        }
    }

    const displayedBids = confirmedBid
        ? [...submittedBids.filter((bid) => bid.id !== confirmedBid.id), confirmedBid]
        : submittedBids;

    return (
        <section className="bid-workflow card" aria-labelledby="bid-form-heading">
            <div className="bid-section-heading">
                <div>
                    <p className="eyebrow">Your response</p>
                    <h2 id="bid-form-heading">Submit a quote</h2>
                </div>
                <span className="bid-currency-label">Amounts in NGN (₦)</span>
            </div>
            <p className="bid-intro">Quote for the work described. Your proposed price is not an agreed amount until the customer accepts it.</p>

            {confirmedBid && (
                <div className="bid-success" role="status">
                    <strong>Bid confirmed by the server.</strong>
                    <span>Reference: {confirmedBid.id}</span>
                    <span>Server status: {confirmedBid.status}</span>
                </div>
            )}
            {error && <p className="bid-error" role="alert">{error}</p>}

            <form className="bid-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                    <label htmlFor="bid-price">Your quote (₦) <span aria-hidden="true">*</span></label>
                    <input id="bid-price" name="price" type="number" inputMode="decimal" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} required aria-describedby="bid-price-help" />
                    <p className="field-hint" id="bid-price-help">Enter a positive amount for the work. Confirm materials and scope before quoting.</p>
                </div>
                <div className="form-field">
                    <label htmlFor="bid-message">Message to the customer <span aria-hidden="true">*</span></label>
                    <textarea id="bid-message" name="message" rows="4" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} required placeholder="Explain your approach, what the quote includes, and any assumptions." />
                    <p className="field-hint">{message.length}/2000 characters</p>
                </div>
                <div className="form-field">
                    <label htmlFor="bid-schedule">Proposed schedule (optional)</label>
                    <input id="bid-schedule" name="proposedSchedule" type="datetime-local" value={schedule} onChange={(event) => setSchedule(event.target.value)} />
                    <p className="field-hint">Suggest a time you can attend. The customer and platform must confirm the final schedule.</p>
                </div>
                <button className="btn btn-primary bid-submit-button" type="submit" disabled={isSubmitting || Boolean(confirmedBid)}>
                    {isSubmitting ? 'Submitting quote…' : confirmedBid ? 'Bid submitted' : 'Submit quote'}
                </button>
                <p className="field-hint">A confirmation appears only after a server response includes a bid reference and its actual status.</p>
            </form>

            <div className="submitted-bids-section">
                <h3>Your submitted bid records</h3>
                <BidStatusList bids={displayedBids} />
            </div>
        </section>
    );
}
