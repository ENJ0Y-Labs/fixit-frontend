import PropTypes from 'prop-types';

function Toggle({ label = 'Toggle', isOn = false, onChange }) {
    return (
        <button
            type="button"
            className={`toggle-switch${isOn ? ' is-on' : ''}`}
            role="switch"
            aria-checked={isOn}
            aria-label={label}
            onClick={() => onChange?.(!isOn)}
        >
            <span></span>
        </button>
    );
}

Toggle.propTypes = {
    label: PropTypes.string,
    isOn: PropTypes.bool,
    onChange: PropTypes.func,
};

export default Toggle;
