// fixit-customer\src\Account.jsx
import avatarPlaceholder from "./assets/avatar-placeholder.svg";
import Toggle from "./Toggle";

function Account() {

    return (
        <div className="account">
            <header>
                <h2>My Profile</h2>
            </header>
            <main>
                <div>
                    <div>
                        <img src={avatarPlaceholder} alt="Profile Picture" />
                        <div>
                            <i className="fa-solid fa-camera"></i>
                        </div>
                    </div>
                    <div>
                        <p>Oluwatobiloba Ajayi</p>
                        <div>
                            <p>
                                <i className="fa-solid fa-envelope-open"></i>
                                t.ajayi@example.com
                            </p>
                            <p>
                                <i className="fa-solid fa-phone"></i>
                                +234 802 ••• 1234
                            </p>
                        </div>
                        <button>Edit Profile</button>
                    </div>
                </div>
                <div>
                    <div className="account-settings">
                        <h4>ACCOUNT SETTINGS</h4>
                        <div>
                            <div>
                                <i className="fa-solid fa-location-dot"></i>
                                <div>
                                    <p>Saved Addresses</p>
                                    <p>Home, Work, and 2 other locations</p>
                                </div>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                            <div>
                                <i className="fa-solid fa-credit-card"></i>
                                <div>
                                    <p>Payment Methods</p>
                                    <p>Mastercard ending in 4242</p>
                                </div>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                            <div>
                                <i className="fa-solid fa-clock-rotate-left"></i>
                                <div>
                                    <p>Job History</p>
                                    <p>View all your past bookings</p>
                                </div>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                        </div>
                    </div>
                    <div className="preference">
                        <h4>PREFERENCES</h4>
                        <div>
                            <div>
                                <i className="fa-solid fa-bell"></i>
                                <div>
                                    <p>Notification</p>
                                    <p>Manage alerts and email preferences</p>
                                </div>
                                <Toggle label="Notifications" />
                            </div>
                            <div>
                                <i className="fa-solid fa-circle-question"></i>
                                <div>
                                    <p>Help & Support</p>
                                    <p>FAQs, Chat Support, and Legal</p>
                                </div>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                            <div>
                                <i className="fa-solid fa-shield-halved"></i>
                                <div>
                                    <p>Security</p>
                                    <p>Password, 2FA, and Logged devices</p>
                                </div>
                                <i className="fa-solid fa-angle-right"></i>
                            </div>
                        </div>
                    </div>
                    <p>FixIt App Version 1.0.4</p>
                    <div>
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                        <p>Safety Tips</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Account;
