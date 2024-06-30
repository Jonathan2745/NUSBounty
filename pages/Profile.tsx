import { useState, useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
// import { useLocalStorage } from "../src/hooks/useLocalStorage.tsx";

export const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(0);

  const handleLogout = () => {
    logout();
  };

  const handleSecrets = () => {
    setShouldNavigate(1);
  };

  const handleHome = () => { 
    setShouldNavigate(2);
  };

  useEffect(() => {
    if (shouldNavigate == 1) {
      navigate("/secret");
    }
    if (shouldNavigate == 2) {
      navigate("/home");
    }
  }, [shouldNavigate, navigate]);

  return (
    <div>
      <h1>This is a Profile page</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleSecrets}>Secrets</button>
      <button onClick={handleHome}>Home</button>
    </div>
  );
};
