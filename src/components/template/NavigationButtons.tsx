import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface NavigationButtonsProps {
  current: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ current }) => {
  const { signOut } = useAuthenticator((context) => [context.user]);  
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(0);

  const handleClasses = (element: string) => {
    if (element === current) {
      return "bg-white text-slate-600 text-center p-0 rounded-none border-slate-600 hover:border-slate-600 border-t-2 border-0 text-nowrap font-semibold mr-3";
    }
    return "bg-white text-slate-500 text-center p-0 rounded-none border-white hover:border-white border-t-2 border-0 hover:text-slate-600 text-nowrap font-normal mr-3 hover:underline";
  }

  const handleWallet = () => {
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

  const handleNewJob = () => {
    setShouldNavigate(6);
  };

  useEffect(() => {
    if (shouldNavigate == 1) {
      navigate("/wallet");
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
    if ( shouldNavigate == 6 ) {
      navigate("/newjob");
    }

    if (shouldNavigate == 2) navigate("/profile");
  }, [shouldNavigate, navigate]);

  const handleProfile = () => {
    setShouldNavigate(2);
  };

  return (
    <div className="flex flex-row gap-2.5 text-lg justify-start flex-wrap">
      <button
        onClick={handleHome}
        className={handleClasses("home")}
      >
        Home
      </button>
      <button
        onClick={handleJobs}
        className={handleClasses("jobs")}
      >
        Jobs
      </button>
      <button
        onClick={handleMyJobs}
        className={handleClasses("my_jobs")}
      >
        My Jobs
      </button>
      <button
        onClick={handleNewJob}
        className={handleClasses("new_job")}
      >
        Create Job
      </button>
      
      <button
        onClick={handleProfile}
        className={handleClasses("profile")}
      >
        Profile
      </button>
      <button
        onClick={handleWallet}
        className={handleClasses("wallet")}
      >
        Wallet
      </button>
      <button
        onClick={signOut}
        className={handleClasses("logout")}
      >
        Logout
      </button>
    </div>
  );
};
