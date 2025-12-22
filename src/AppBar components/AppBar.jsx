import React, { useState, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { API_URL } from "../config";
import "./AppBar.css";

const AppBar = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="app-bar">
        <div className="app-bar-content">
          <div className="welcome-section">
            <div className="skeleton-text"></div>
          </div>
          <div className="profile-section">
            <div className="skeleton-avatar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bar">
      <div className="app-bar-content">
        <div className="welcome-section">
          <h2 className="greeting">
            {getGreeting()}, {user?.username || "User"}! 👋
          </h2>
          <p className="subtitle">Here's your task overview</p>
        </div>
        <div className="profile-section">
          <ProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
};

export default AppBar;
