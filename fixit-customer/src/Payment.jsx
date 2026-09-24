import './styles/pages/payment.css';
import PaymentMethod from './payment/PaymentMethod';
import OrderSummary from './payment/OrderSummary';

function Payment({ job, onBack, onPaymentComplete }) {
    return (
        <div className="payment page-surface">
            <header className="page-header payment-header">
                <button type="button" className="back-button" aria-label="Go back" onClick={onBack}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1>Checkout</h1>
            </header>

            <main className="payment-main">
                <div className="payment-left">
                    <section className="escrow-payment">
                        <div className="escrow-icon"><i className="fa-solid fa-shield-halved"></i></div>
                        <div>
                            <h2>Secure Escrow Payment</h2>
                            <p>FixIt holds your payment securely until you confirm the service is completed. If there is an issue, our support team can help with disputes and refunds.</p>
                        </div>
                    </section>

                    <section className="payment-method">
                        <div className="payment-section-heading">
                            <h2>Payment Method</h2>
                            <button type="button">+ Add New</button>
                        </div>
                        <div className="method-list">
                            <PaymentMethod />
                            <PaymentMethod icon="fa-brands fa-cc-visa" title="Visa •••• 8812" details="Expires 12/25" />
                            <PaymentMethod icon="fa-solid fa-building-columns" title="Pay with Bank Transfer" details="Via Paystack/Flutterwave" />
                        </div>
                    </section>

                    <section className="promo-code">
                        <div>
                            <i className="fa-solid fa-ticket" aria-hidden="true"></i>
                            <input type="text" name="promo-code" id="promo-code" placeholder="Promo Code" aria-label="Promo code" />
                        </div>
                        <button type="button">Apply</button>
                    </section>
                </div>

                <aside className="payment-right">
                    <section className="order-summary">
                        <OrderSummary title={job?.title} provider={job?.provider || job?.providerName} price={job?.price || job?.priceValue || 0} onPayment={onPaymentComplete} />
                    </section>
                    <button type="button" className="help-card" onClick={onBack}>
                        <span className="help-icon"><i className="fa-solid fa-headset"></i></span>
                        <span>
                            <strong>Need help with payment?</strong>
                            <small>Contact our 24/7 support team</small>
                        </span>
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </aside>
            </main>
        </div>
    );
}

export default Payment;
