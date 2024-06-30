import { useAuth } from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const NavigationButtons = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(0);

  const handleLogout = () => {
    logout();
  };

  const handleSecrets = () => {
    setShouldNavigate(1);
  };

  useEffect(() => {
    if (shouldNavigate == 1) {
      navigate("/secret");
    }
    if (shouldNavigate == 2) navigate("/profile");
  }, [shouldNavigate, navigate]);

  const handleProfile = () => {
    setShouldNavigate(2);
  };

  return (
    <div>
      <button onClick={handleProfile}>Profile</button>
      <button onClick={handleSecrets}>My Secrets</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
