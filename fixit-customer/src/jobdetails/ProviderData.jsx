// fixit-customer\src\jobdetails\ProviderData.jsx
import avatarPlaceholder from "../assets/avatar-placeholder.svg";

function ProviderData({
    name = "John Doe",
    title = "Unspecified",
    avatarurl = "",
    rating = 0,
    reviewcount = 0,
    isonline = false
}) {

    const onlinestatus = <div className="online"></div>
    const offlinestatus = <div className="offline"></div>

    return(
        <>
            <h2>Assigned Provider</h2>
            <div className="provider-details">
                <img src={avatarurl || avatarPlaceholder} alt={`${name} profile picture`} />
                <div>
                    <div>
                        <h2>{name}</h2>
                        {isonline? onlinestatus: offlinestatus}
                    </div>
                    <p>{title}</p>
                    <div>
                        <i className="fa-solid fa-star"></i>
                        <p>{rating}</p>
                        <p>({reviewcount} reviews)</p>
                    </div>
                </div>
            </div>
            <div className="contact-buttons">
                <button>
                    <i className="fa-regular fa-message"></i>
                    <p>Chat with Provider</p>
                </button>
                <button>
                    <i className="fa-solid fa-phone"></i>
                    <p>Call Provider</p>
                </button>
            </div>
            <button>VIEW FULL PROFILE</button>
        </>
    );
}

export default ProviderData;
