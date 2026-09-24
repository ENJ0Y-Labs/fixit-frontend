// fixit-customer\src\Payment.jsx
import PaymentMethod from "./payment/PaymentMethod"
import OrderSummary from "./payment/OrderSummary"

function Payment() {
    
    return(
        <div className="payment">
            <header>
                <button type="button" className="plain-button" aria-label="Go back">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2>Checkout</h2>
            </header>
            <main>
                <div>
                    <div className="escrow-payment">
                        <i className="fa-solid fa-shield-halved"></i>
                        <div>
                            <h2>Secure Escrow Payment</h2>
                            <p>FixIt holds your payment securely until you confirm the service is completed. If there's an issue, our support team is here to help with disputes and refunds.</p>
                        </div>
                    </div>
                    <div className="payment-method">
                        <div>
                            <h2>Payment Method</h2>
                            <button type="button" className="plain-button">+ Add New</button>
                        </div>
                        <div className="method-list">
                            <PaymentMethod />
                            <PaymentMethod icon = "fa-brands fa-cc-visa" title="Visa •••• 8812" details="Expires 12/25"/>
                            <PaymentMethod icon = "fa-solid fa-building-columns" title="Pay with Bank Transfer" details="Via Paystack/Flutterwave"/>
                        </div>
                    </div>
                    <div className="promo-code">
                        <div>
                            <i className="fa-solid fa-ticket"></i>
                            <input type="text" name="promo-code" id="promo-code" placeholder="Promo Code" aria-label="Promo code" />
                        </div>
                        <button>Apply</button>
                    </div>
                </div>
                <div>
                    <div className="order-summary">
                        <OrderSummary />
                    </div>
                    <div className="help">
                        <div>
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <div>
                            <p>Need help with payment?</p>
                            <p>Contact our 24/7 support team</p>
                        </div>
                        <div>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Payment;
