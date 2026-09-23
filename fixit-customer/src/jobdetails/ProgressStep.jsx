// fixit-customer\src\jobdetails\ProgressStep.jsx

function ProgressStep({
    icon = "fa-solid fa-flag-checkered",
    title = "Unknown",
    description = "",
    timestamp = "Sun, 1 Jan, • 12:00 AM"
    // status = "current"
}) {

    return(
        <>
            <div>
                <i className={icon}></i>
            </div>
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            <div>
                <p>{timestamp}</p>
            </div>
        </>
    );
}

export default ProgressStep;