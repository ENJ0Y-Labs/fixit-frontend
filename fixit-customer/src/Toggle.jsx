// fixit-customer\src\Toggle.jsx

function Toggle({
    label = "Toggle"
}) {
    return (
        // TODO(integration): drive aria-checked and the click handler from real state
        <button type="button" role="switch" aria-checked="true" aria-label={label} className="toggle-switch">
            <span></span>
        </button>
    );
}

export default Toggle;
