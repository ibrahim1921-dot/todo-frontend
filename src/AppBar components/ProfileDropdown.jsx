import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "./ProfileDropdown.css";

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logged out successfully");
        if (onLogout) {
          onLogout();
        }
        navigate('/login', { replace: true });
      }else {
        throw new Error("Logout failed");
      }
      
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return "#667eea";
    const colors = [
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#4facfe",
      "#43e97b",
      "#fa709a",
      "#fee140",
      "#30cfd0",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="avatar-image" />
        ) : (
          <div
            className="avatar-placeholder"
            style={{ backgroundColor: getAvatarColor(user?.username) }}
          >
            {getInitials(user?.username)}
          </div>
        )}
        <span className="dropdown-icon">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div
              className="dropdown-avatar"
              style={{ backgroundColor: getAvatarColor(user?.username) }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                getInitials(user?.username)
              )}
            </div>
            <div className="dropdown-user-info">
              <p className="dropdown-username">{user?.username}</p>
              <p className="dropdown-email">{user?.email}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-items">
    
            
          
          </div>


          <button
            className="dropdown-item logout-item"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span className="item-icon">🚪</span>
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
