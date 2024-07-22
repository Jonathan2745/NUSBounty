import { Menu, MenuItem, MenuButton, Divider  } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState } from "react";
import type { Schema } from '../../../amplify/data/resource';
import { generateClient } from "aws-amplify/api";
import { useEffect } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';


export const NotificationIcon = () => {
    const { user } = useAuthenticator((context) => [context.user]); 
    const client = generateClient<Schema>();   
    type User = Schema['User']['type'];
    const [ currentUser, setCurrentUser ] = useState<User | null>(null);
    const [Notifications, setNotifications] = useState<Schema["Notifications"]["type"][]>([]);

    const fetchCurrentUser = async () => {
      if (user) {
        const { data: currentuser, errors } = await client.models.User.get({
          userId: user.userId,
        });
        if (errors) {
          console.error("User not found");
        } else {
          try {
            setCurrentUser(currentuser);
          } catch (error) {
            console.error("Error setting current user", error);
          }
        }
      } else {
        console.error("No user found");
      }
    };

    // Fetches Notifications assigned to currentUser //
    const fetchNotifs = async () => {
      if (currentUser && currentUser.userId) {
        const { data: items } = await client.models.Notifications.list({
          filter: {
            Userfor: { eq: currentUser.userId }
          }
        });
        setNotifications(items);
      } else {
        console.error("Error fetching notifications");
      }
    };

    // Deletes Notification selected by current user //
    function deleteNotif(id: string) {
      client.models.Notifications.delete({ id })
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }

    useEffect(() => {
      fetchNotifs();
      fetchCurrentUser();
    }, [currentUser, deleteNotif]);
      
    
    return (
      <div className="my-2" >
        <Menu menuAlign="start"
        trigger={
          <MenuButton variation="primary" size="small" width="40%">
            {Notifications.length > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </MenuButton>}
        >
          { Notifications.length > 0 ?
        <MenuItem isDisabled > Notifications </MenuItem>
        :  <MenuItem isDisabled > No New Notifications </MenuItem>
          }
        <Divider/>
          { Notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={() => deleteNotif(notification.id)}>
              {notification.content}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };
  