// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// export const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     // user is not authenticated
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

// import React from "react";
// import { Navigate } from "react-router-dom";
// // import { useAuth } from "../hooks/useAuth";
// import { Authenticator } from "@aws-amplify/ui-react";


// // Define the ProtectedRouteProps interface
// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     // user is not authenticated
//     return <Navigate to="/login" />;
//   }
//   return <>{children}</>;
// };


import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       if (authStatus === 'authenticated');
  //       setIsAuthenticated(true);
  //     } catch {
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  if (authStatus === 'configuring' && 'Loading...') {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

