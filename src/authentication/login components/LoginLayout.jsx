import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import GoogleAuthButton from "../Registration components/GoogleAuthButton";
import { API_URL } from "../../config";
import "./LoginLayout.css";

const LoginLayout = ({ onAuthSuccess }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.errors?.[0]?.msg || "Login failed");
      }

      // Cookie is automatically set by the server (httpOnly)
      if (onAuthSuccess) {
        await onAuthSuccess();
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert("Forgot password feature coming soon!");
  };

  return (
    <div className="login-layout">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your tasks</p>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          onForgotPassword={handleForgotPassword}
        />

        <div className="divider">
          <span>OR</span>
        </div>

        <GoogleAuthButton onClick={handleGoogleAuth} />

        <div className="register-redirect">
          <p>
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
