import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);


  if (authStatus === 'configuring' && 'Loading...') {
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

