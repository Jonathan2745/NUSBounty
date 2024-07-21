import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Divider, useAuthenticator } from "@aws-amplify/ui-react";


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
    <div className="flex flex-col gap-2.5 text-white text-xl font-bold justify-start">
      <button
        onClick={handleProfile}
        className="bg-white text-slate-500 text-start rounded-md p-0 hover:underline hover:text-slate-600 border-none text-nowrap mr-3"
      >
        Profile
      </button>
      <Divider className="border-slate-300" />
      <button
        onClick={handleSecrets}
        className="bg-white text-slate-500 text-start rounded-md p-0 hover:underline hover:text-slate-600 border-none text-nowrap mr-4"
      >
        My Wallet
      </button>
      <Divider className="border-slate-300" />
      <button
        onClick={handleJobs}
        className="bg-white text-slate-500 text-start rounded-md p-0 hover:underline hover:text-slate-600 border-none text-nowrap mr-4"
      >
        Jobs Page
      </button>
      <Divider className="border-slate-300" />
      <button
        onClick={handleHome}
        className="bg-white text-slate-500 text-start rounded-md p-0 hover:underline hover:text-slate-600 border-none text-nowrap mr-4"
      >
        Home Page
      </button>
      <Divider className="border-slate-300" />
      <button
        onClick={handleMyJobs}
        className="bg-white text-slate-500 text-start rounded-md p-0 hover:underline hover:text-slate-600 border-none text-nowrap mr-4"
      >
        My Jobs Page
      </button>
      <Divider className="border-slate-300" />
      <button
        onClick={signOut}
        className="bg-white text-slate-500 text-start rounded-md p-0 hover:underline hover:text-slate-600 border-none text-nowrap mr-4"
      >
        Logout
      </button>
    </div>
  );
};
