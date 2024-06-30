import { useAuth } from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";


export const NavigationButtons = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(0);

  const handleLogout = () => {
    logout();
  };

  const handleSecrets = () => {
    setShouldNavigate(1);
  };
  const handleJobs = () => {
    setShouldNavigate(3);
  };
  useEffect(() => {
    if (shouldNavigate == 1) {
      navigate("/secret");
    }
    if ( shouldNavigate == 3 ) {
      navigate("/jobs")
    }
    if (shouldNavigate == 2) navigate("/profile");
  }, [shouldNavigate, navigate]);

  const handleProfile = () => {
    setShouldNavigate(2);
  };

  return (
    <div className="flex space-x-4 m-3 text-white text-lg font-bold">
      <button
        onClick={handleProfile}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        Profile
      </button>
      <button
        onClick={handleSecrets}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        My Secrets
      </button>
      <button
        onClick={handleJobs}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        Jobs Page
      </button>
      <button
        onClick={signOut}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        Logout
      </button>

    </div>
  );
};
