import { useState } from "react"; // ✅ useState import qilingan
import { useTheme } from "@/hooks/useTheme";
import { useStore } from "@/hooks/useStore"; 
import { FaUser, FaCog, FaLock, FaPowerOff, FaEllipsisV } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

function Sidebar() {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <Link to="/">GroupMart</Link>
      <div className="sidebar-content">   
        <div className="profile">
          <img
            src="avatar.jpg"
            alt="Profile"
            className="avatar"
          />
          <div className="info">
            <h4>{user ? user.name : "Guest"}</h4>
            <p>{user ? `@${user.username}` : "No username"}</p>
          </div>
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            <FaEllipsisV />
          </button>
        </div>

        <div className={`dropdown ${isOpen ? "open" : ""}`}>
          <ul>
            <li>
              <FaUser /> My Account
            </li>
            <li>
              <FaCog /> Settings
            </li>
            <li>
              <FaLock /> Lock Screen
            </li>
            <li onClick={logout}> 
              <FaPowerOff /> Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
