import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";


export const NavigationButtons = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);  
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(0);



  const handleSecrets = () => {
    setShouldNavigate(1);
  };
  const handleJobs = () => {
    setShouldNavigate(3);
  };
  const handleHome = () => {
    setShouldNavigate(4);
  };
  const handleMyJobs = () => {
    setShouldNavigate(5);
  };

  useEffect(() => {
    if (shouldNavigate == 1) {
      navigate("/secret");
    }
    if ( shouldNavigate == 3 ) {
      navigate("/jobs");
    }
    if ( shouldNavigate == 4 ) {
      navigate("/home");
    }
    if ( shouldNavigate == 5 ) {
      navigate("/myjobs");
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
        My Wallet
      </button>
      <button
        onClick={handleJobs}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        Jobs Page
      </button>
      <button
        onClick={handleHome}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        Home Page
      </button>
      <button
        onClick={handleMyJobs}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        My Jobs Page
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
