import { useAuth } from "../src/hooks/useAuth.tsx";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export const Secret:React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  

  return (
    <div>
      <h1>This is a Secret page</h1>
      <StorageImage alt="sleepy-cat" path="public/cat.jpg" />;
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};