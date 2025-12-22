import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MyComponent from "./MyComponent.jsx";
import RegistrationLayout from "./authentication/Registration components/RegistrationLayout.jsx";
// import LoginLayout from "./authentication/Login components/LoginLayout";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { API_URL } from "./config";
import LoginLayout from "./authentication/login components/LoginLayout.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking auth status from:", `${API_URL}/api/auth/me`);
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send httpOnly cookie
      });

      console.log("Auth check response status:", response.status); // Debug log

      if (response.ok) {
        const data =await response.json();
        console.log("User is authenticated", data.user); // Debug log
        setIsAuthenticated(true);
      } else {
        console.log("User is not authenticated"); // Debug log
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace/>
            ) : (
              <RegistrationLayout onAuthSuccess={checkAuth} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginLayout onAuthSuccess={checkAuth} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MyComponent setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
