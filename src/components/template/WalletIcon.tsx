import { Menu, MenuItem } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";  


export const WalletIcon = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
  
    return (
      <div className="my-2">
        <Menu>
          <MenuItem
            onClick={() => {
              navigate("/profile");
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  };
  