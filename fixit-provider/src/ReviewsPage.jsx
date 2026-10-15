import './CommunicationAccountPages.css';

function ReviewDate({ value }) {
    if (!value) return null;
    const date = new Date(value);
    return <time dateTime={value}>{Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(date)}</time>;
}

export default function ReviewsPage({ dataState = 'unconfigured', reviews = [], summary }) {
    if (dataState === 'loading') return <section className="card comm-state" aria-busy="true"><h1>Reviews</h1><p>Loading customer reviews…</p></section>;
    if (dataState === 'error') return <section className="card comm-state" role="alert"><h1>Reviews</h1><p>We couldn’t load your reviews. Try again later.</p></section>;
    if (dataState === 'unconfigured') return <div className="communication-page"><div className="page-heading"><div><p className="eyebrow">Customer feedback</p><h1>Reviews</h1><p>Read feedback customers have submitted for your completed work.</p></div></div><section className="card comm-unavailable" role="status"><h2>Reviews are not connected</h2><p>No review records or rating summary are available from the current workspace. Ratings are not estimated or invented.</p></section></div>;
    return <div className="communication-page"><div className="page-heading"><div><p className="eyebrow">Customer feedback</p><h1>Reviews</h1><p>Only reviews returned by the platform appear here.</p></div></div>
        {summary && <section className="card comm-review-summary" aria-label="Review summary"><div><span className="earning-label">Average rating</span><strong>{Number.isFinite(Number(summary.averageRating)) ? `${Number(summary.averageRating).toFixed(1)} / 5` : 'Not available'}</strong></div><div><span className="earning-label">Review count</span><strong>{Number.isInteger(summary.count) && summary.count >= 0 ? summary.count : 'Not available'}</strong></div></section>}
        {reviews.length === 0 ? <section className="card comm-empty"><h2>No reviews yet</h2><p>Customer reviews will appear here when the platform returns them for your account.</p></section> : <div className="comm-review-list">{reviews.map((review) => <article className="card comm-review" key={review.id}><header><div><h2>{review.customerName || 'Customer'}</h2><p>{review.jobTitle || 'Completed job'}{review.jobReference ? ` · ${review.jobReference}` : ''}</p></div><strong aria-label={Number.isFinite(Number(review.rating)) && review.rating !== '' ? `${review.rating} out of 5 stars` : 'Rating not available'}>{Number.isFinite(Number(review.rating)) && review.rating !== '' && Number(review.rating) >= 0 && Number(review.rating) <= 5 ? `${Number(review.rating)} / 5` : 'No rating'}</strong></header><p>{review.comment || 'No written comment provided.'}</p><small><ReviewDate value={review.createdAt} /></small></article>)}</div>}
    </div>;
}
