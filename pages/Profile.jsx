import React, { useState, useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../src/hooks/useLocalStorage";

export const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = () => {
    setShouldNavigate(true);
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate("/secret");
    }
  }, [shouldNavigate, navigate]);

  return (
    <div>
      <h1>This is a Profile page</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleNavigate}>My Secrets</button>
    </div>
  );
};
