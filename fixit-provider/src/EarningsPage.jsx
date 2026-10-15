import './CommunicationAccountPages.css';

export function formatNaira(amount) {
    const value = Number(amount);
    if (!Number.isFinite(value)) return 'Not available';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(value);
}

export function calculateEarnings(records = []) {
    return records.reduce((totals, record) => {
        const amount = Number(record.amount);
        if (!Number.isFinite(amount) || amount < 0) return totals;
        if (['estimated', 'agreed', 'paid'].includes(record.amountType)) totals[record.amountType] += amount;
        return totals;
    }, { estimated: 0, agreed: 0, paid: 0 });
}

const labels = { estimated: 'Estimated', agreed: 'Agreed', paid: 'Paid' };

export default function EarningsPage({ dataState = 'unconfigured', records = [], payoutStatus }) {
    if (dataState === 'loading') return <section className="card comm-state" aria-busy="true"><h1>Earnings</h1><p>Loading earnings and payment history…</p></section>;
    if (dataState === 'error') return <section className="card comm-state" role="alert"><h1>Earnings</h1><p>We couldn’t load earnings. No payment state has been changed.</p></section>;
    if (dataState === 'unconfigured') return <div className="communication-page"><div className="page-heading"><div><p className="eyebrow">Financial overview</p><h1>Earnings</h1><p>View amounts and payment records returned by the platform.</p></div></div><section className="card comm-unavailable" role="status"><h2>Earnings data is not connected</h2><p>There are no verified earnings records available in this workspace. No totals are shown as real account figures.</p></section><section className="card comm-unavailable"><h2>Payouts are unavailable</h2><p>Payout setup and withdrawals are not connected here. This screen cannot initiate or confirm a payout.</p></section></div>;
    const totals = calculateEarnings(records);
    return <div className="communication-page"><div className="page-heading"><div><p className="eyebrow">Financial overview</p><h1>Earnings</h1><p>Agreed work is not proof of payment.</p></div></div>
        <section className="earnings-grid comm-earnings-summary" aria-label="Earnings totals">{Object.entries(labels).map(([key, label]) => <article className="card earning-item" key={key}><span className="earning-label">{label}</span><strong>{formatNaira(totals[key])}</strong><p>{key === 'estimated' ? 'Quotes or bids, not yet agreed.' : key === 'agreed' ? 'Customer-agreed amounts, not necessarily paid.' : 'Records classified as paid by the data source.'}</p></article>)}</section>
        <section className="card comm-history"><div className="card-header"><div><h2>Payment history</h2><p>Records and statuses supplied by the backend.</p></div></div>
            {records.length === 0 ? <div className="comm-empty"><h3>No earnings records</h3><p>There are no earnings or payment records to display yet.</p></div> : <div className="comm-table-wrap"><table><thead><tr><th scope="col">Reference</th><th scope="col">Job</th><th scope="col">Type</th><th scope="col">Amount</th><th scope="col">Status</th><th scope="col">Date</th></tr></thead><tbody>{records.map((record) => <tr key={record.id}><td>{record.reference || record.id}</td><td>{record.jobTitle || 'Not provided'}</td><td>{labels[record.amountType] || 'Unclassified'}</td><td>{formatNaira(record.amount)}</td><td>{record.status || 'Not provided'}</td><td>{record.createdAt || 'Not provided'}</td></tr>)}</tbody></table></div>}
        </section><section className="card comm-unavailable"><h2>Payouts</h2><p>{payoutStatus ? `Payout availability reported by the backend: ${payoutStatus}.` : 'Payout setup and withdrawals are not available in this interface. No payout status has been assumed.'}</p><button className="btn btn-secondary" type="button" disabled>Withdraw funds · Unavailable</button></section>
    </div>;
}
