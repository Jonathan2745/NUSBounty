import { Menu, MenuItem } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

export const MenuOptions = () => {
  const { signOut } = useAuthenticator((context) => [context.user]);  
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuItem
        onClick={() => {
          navigate("/profile");
        }}
      >
        My Profile
      </MenuItem>
      <MenuItem onClick={signOut}>Logout</MenuItem>
    </Menu>
  );
};
