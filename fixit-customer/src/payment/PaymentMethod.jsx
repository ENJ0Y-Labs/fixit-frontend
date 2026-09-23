// fixit-customer\src\payment\PaymentMethod.jsx

function PaymentMethod({
    icon = "fa-solid fa-credit-card",
    title = "Mastercard •••• 4242",
    details = "Expires 08/27 • John D.",
}) {

    return(
        <div className="method">
            <div>
                <i className={icon}></i>
                <div>
                    <p>{title}</p>
                    <p>{details}</p>
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default PaymentMethod;