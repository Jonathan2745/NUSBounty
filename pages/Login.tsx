import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import React, { useEffect } from "react";
import { NavigationButtons } from '../src/components/NavigationButtons';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const LoginPage: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  const checkandCreateUser = async() => {
    try {
      const userid = user?.userId;
      const username = user?.username;
      const currentUser = await client.models.User.get({
        userId: userid,
      })

      if (!currentUser || !Object.keys(currentUser.data ?? {}).length){
        await client.models.User.create({
          userId: userid,
          username: username,
          walletBalance: 0,
        })
        console.log("created user")
      }

    } catch (error) {
      console.error("error creating or checking current user", error );
    }
  }

  useEffect(() => {
    if (user) {
      checkandCreateUser();
      console.log( "Checked and created user", user)
    }
  }, [user]);


  return (
    <div>
    <h1 className="text-5xl mb-6 font-semibold"> Welcome to NUSBounty </h1>
    <Authenticator>
      {({ user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <NavigationButtons />
        </main>
      )}
    </Authenticator>
    </div>  

  );
}