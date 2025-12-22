import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import GoogleAuthButton from "./GoogleAuthButton";
import { API_URL } from "../../config";
import "./RegistrationLayout.css";

const RegistrationLayout = ({onAuthSuccess}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.errors?.[0]?.msg || "Registration failed"
      );
    }
    if(onAuthSuccess){
        await onAuthSuccess();
    }
    // Redirect to dashboard
    navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="registration-layout">
      <div className="registration-container">
        <div className="registration-header">
          <h1>Create Account</h1>
          <p>Start organizing your tasks today</p>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <RegistrationForm onSubmit={handleRegister} loading={loading} />

        <div className="divider">
          <span>OR</span>
        </div>

        <GoogleAuthButton onClick={handleGoogleAuth} />

        <div className="login-redirect">
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationLayout;
