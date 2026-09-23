// fixit-customer\src\payment\OrderSummary.jsx

function OrderSummary({
    icon = "fa-solid fa-question",
    title = "Unknown",
    provider = "John Doe",
    id = "JOB-09123",
    price = 12500
}) {
    const platformpercent = 0.05
    const vatpercent = 0.075

    const platformfee = platformpercent * price 
    const vat = vatpercent * price 

    const total = price + platformfee + vat

    return (
        <>
            <h2>Order Summary</h2>
            <div className="order-details">
                <i className={icon}></i>
                <div>
                    <p>{title}</p>
                    <p>Provider: {provider}</p>
                    <p>Id: #{id}</p>
                </div>
            </div>
            <hr />
            <div className="payment-breakdown">
                <div>
                    <p>Service Price</p>
                    <p>N{price}</p>
                </div>
                <div>
                    <p>Platform Fee (5%)</p>
                    <p>N {platformfee}</p>
                </div>
                <div>
                    <p>VAT (7.5%)</p>
                    <p>N{vat}</p>
                </div>
            </div>
            <hr />
            <div className="confirm-submit">
                <div>
                    <p>Total to Pay</p>
                    <p>N{total}</p>
                </div>
                <button>Pay N{total} Now</button>
                <p>
                    <i className="fa-solid fa-lock"></i>
                     SSL ENCRYPTED PAYMENT
                </p>
                <div>
                    <p>By completing this payment, you agree to our <a href="">Terms of Service</a> and <a href="">Refund Policy</a>.</p>
                </div>
            </div>
        </>
    );
}

export default OrderSummary;