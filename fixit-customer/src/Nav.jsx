// fixit-customer\src\Nav.jsx

function Nav() {

  const userName = "O. Ajayi";
  const userLocation = "Lekki Phase 1";

  return (
    <nav>
      <div className="logo">
        <div className="logo-icon">F</div>
        <div className="logo-text">FixIt</div>
      </div>

      <div className="nav-links">
        <div className="nav-item">
          <a href="">
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </a>
        </div>

        <div className="nav-item">
          <a href="">
            <i className="fa-solid fa-briefcase"></i>
            <span>My Jobs</span>
          </a>
        </div>

        <div className="nav-item">
          <a href="">
            <i className="fa-solid fa-message"></i>
            <span>Messages</span>
          </a>
        </div>

        <div className="nav-item">
          <a href="">
            <i className="fa-solid fa-user"></i>
            <span>Profile</span>
          </a>
        </div>

        <div className="nav-item">
          <a href="">
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </a>
        </div>
      </div>

      <div className="user-profile">
        <div className="user-avatar">
          <i className="fa-solid fa-user"></i>
        </div>

        <div className="user-info">
          <div className="user-name">{userName}</div>
          <div className="user-role">{userLocation}</div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;