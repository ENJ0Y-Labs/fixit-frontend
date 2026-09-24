function ProgressStep({
    icon = 'fa-solid fa-flag-checkered',
    title = 'Unknown',
    description = '',
    timestamp = 'Sun, 1 Jan • 12:00 AM',
}) {
    return (
        <div className="progress-step">
            <div className="progress-icon"><i className={icon}></i></div>
            <div className="progress-copy">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <p className="progress-time">{timestamp}</p>
        </div>
    );
}

export default ProgressStep;
