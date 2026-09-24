function formatNaira(value) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

function OrderSummary({
    icon = 'fa-solid fa-faucet',
    title = 'Fixing Kitchen Sink Leak',
    provider = 'Emeka Nwachukwu',
    id = 'JOB-09123',
    price = 12500,
    onPayment,
}) {
    const platformFee = price * 0.05;
    const vat = price * 0.075;
    const total = price + platformFee + vat;

    return (
        <>
            <h2>Order Summary</h2>
            <div className="order-details">
                <div className="order-icon"><i className={icon}></i></div>
                <div>
                    <strong>{title}</strong>
                    <p>Provider: {provider}</p>
                    <p>Job ID: #{id}</p>
                </div>
            </div>
            <hr />
            <div className="payment-breakdown">
                <div><span>Service Price</span><strong>{formatNaira(price)}</strong></div>
                <div><span>Platform Fee (5%)</span><strong>{formatNaira(platformFee)}</strong></div>
                <div><span>VAT (7.5%)</span><strong>{formatNaira(vat)}</strong></div>
            </div>
            <hr />
            <div className="confirm-submit">
                <div className="total-row">
                    <span>Total to Pay</span>
                    <strong>{formatNaira(total)}</strong>
                </div>
                <button type="button" className="dark-button full-width" onClick={onPayment}>Pay {formatNaira(total)} Now</button>
                <p className="ssl-note"><i className="fa-solid fa-lock"></i> SSL ENCRYPTED PAYMENT</p>
                <p className="terms-copy">By completing this payment, you agree to our <a href="#terms">Terms of Service</a> and <a href="#refund">Refund Policy</a>.</p>
            </div>
        </>
    );
}

export default OrderSummary;
