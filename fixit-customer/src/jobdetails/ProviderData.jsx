import avatarPlaceholder from '../assets/avatar-placeholder.svg';

function ProviderData({
    name = 'John Doe',
    title = 'Unspecified',
    avatarurl = '',
    rating = 0,
    reviewcount = 0,
    isonline = false,
    onMessages,
}) {
    return (
        <>
            <div className="provider-heading-row">
                <h2>Assigned Provider</h2>
                <span className={`online-badge ${isonline ? 'online' : 'offline'}`}>
                    {isonline ? 'Online' : 'Offline'}
                </span>
            </div>

            <div className="provider-details">
                <img src={avatarurl || avatarPlaceholder} alt={`${name} profile`} />
                <div>
                    <h3>{name}</h3>
                    <p>{title}</p>
                    <div className="provider-rating">
                        <i className="fa-solid fa-star"></i>
                        <strong>{Number(rating).toFixed(1)}</strong>
                        <span>({reviewcount} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="contact-buttons">
                <button type="button" className="outline-button" onClick={onMessages}>
                    <i className="fa-regular fa-message"></i>
                    <span>Chat with Provider</span>
                </button>
                <button type="button" className="outline-button">
                    <i className="fa-solid fa-phone"></i>
                    <span>Call Provider</span>
                </button>
            </div>
            <button type="button" className="profile-link-button">VIEW FULL PROFILE</button>
        </>
    );
}

export default ProviderData;
