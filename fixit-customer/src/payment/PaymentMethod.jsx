import { useState } from 'react';
import PropTypes from 'prop-types';

function PaymentMethod({
    icon = 'fa-solid fa-credit-card',
    title = 'Mastercard •••• 4242',
    details = 'Expires 08/27 • John D.',
}) {
    const [selected, setSelected] = useState(title.startsWith('Mastercard'));

    return (
        <button type="button" className={`method${selected ? ' selected' : ''}`} onClick={() => setSelected(true)}>
            <span className="method-icon"><i className={icon}></i></span>
            <span className="method-copy">
                <strong>{title}</strong>
                <small>{details}</small>
            </span>
            <span className="method-radio" aria-hidden="true"></span>
        </button>
    );
}

PaymentMethod.propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    details: PropTypes.string,
};

export default PaymentMethod;
