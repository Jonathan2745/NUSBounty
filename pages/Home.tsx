

import { type Schema } from '../amplify/data/resource';
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";
import MainTemplate from "../src/components/template/MainTemplate";
import { useAuthenticator } from '@aws-amplify/ui-react';

export const HomePage = () => {
  const { user } = useAuthenticator((context) => [context.user]); // Move this inside the component

  // Generate useStates adn Schemas used for Home Page //
  const client = generateClient<Schema>();
  const [Notifications, setNotifications] = useState<Schema["Notifications"]["type"][]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  type User = Schema['User']['type'];

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
  
  // Testing Feature to allow currentUser to create Notifications for themselves //
  const createNotif = async () => {
    if (currentUser) {
      const { data: newNotif } = await client.models.Notifications.create({
        content: window.prompt("Notification content ?"),
        isDone: false,
        Userfor: currentUser.userId,
      });

      if (newNotif) {
        console.log(newNotif.Userfor);
        setNotifications(prev => [...prev, newNotif]);
      } else {
        console.error("Error creating notification");
      }
    } else {
      console.error("Error creating notification");
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
  }, [currentUser]);

  return (
    <MainTemplate>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-5xl mb-6 font-semibold">Home Page</h1>
        <button onClick={createNotif}>Add new Notif</button>
        <p>Notifications</p>
        <ul>
          {Notifications.map(({ id, content }) => (
            <li key={id} onClick={() => deleteNotif(id)}>{content}</li>
          ))}
        </ul>
      </div>
    </MainTemplate>
  );
};


