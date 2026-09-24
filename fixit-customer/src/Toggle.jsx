import { useState } from 'react';
import PropTypes from 'prop-types';

function Toggle({ label = 'Toggle', defaultChecked = true, disabled = false }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`toggle-switch${checked ? ' is-on' : ''}`}
            onClick={() => setChecked((current) => !current)}
            disabled={disabled}
        >
            <span aria-hidden="true"></span>
        </button>
    );
}

Toggle.propTypes = {
    label: PropTypes.string,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
};

export default Toggle;
