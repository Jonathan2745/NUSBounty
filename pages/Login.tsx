import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useState } from "react";
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';
import { useNavigate } from 'react-router-dom';

const client = generateClient<Schema>();

const checkAndCreateUser = async (user: any) => {
  try {
    const userid = user?.userId;
    const username = user?.username;
    const currentUser = await client.models.User.get({
      userId: userid,
    });

    if (!currentUser || !Object.keys(currentUser.data ?? {}).length) {
      await client.models.User.create({
        userId: userid,
        username: username,
        walletBalance: 400,
      });
      console.log("Created user");
    } else {
      console.log("User already exists");
    }
  } catch (error) {
    console.error("Error creating or checking current user", error);
  }
};

const Login: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [userUsername, setUserUsername] = useState("");

  useEffect(() => {
    if (user) {
      checkAndCreateUser(user);
      setUserUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (userUsername) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        navigate('/home');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [userUsername, navigate]);

  return (
    <Authenticator.Provider>
      <div className='flex flex-col justify-center items-center min-h-screen min-w-full'>
        <h1 className="text-5xl mb-6 font-semibold">Welcome to NUSBounty</h1>

        <Authenticator>
          {({ user }) => (
            <main>
              {showWelcome && <h1>Hello {user?.username}</h1>}
            </main>
          )}
        </Authenticator>
      </div>
    </Authenticator.Provider>
  );
};

export default Login;
