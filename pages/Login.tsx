import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React, { useEffect } from "react";
import MainTemplate  from "../src/components/template/MainTemplate.tsx";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';


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

  // const [userUsername, setUserUsername] = useState(null);

  // useEffect(() => {
  //   fetchUserAttributes();
  // }, []);

  //   const fetchUserAttributes = async() => {
  //       user.signInDetails?.loginId      
  //   }


  return (
    <div>
    <div className='flex flex-col justify-center items-center min-h-screen min-w-full'>
    <h1 className="text-5xl mb-6 font-semibold"> Welcome to NUSBounty </h1>
    
    <Authenticator>
      {({ user }) => (
        <MainTemplate currentNavigation={7} >
          <main>
            <h1>Hello {user?.signInDetails?.loginId}</h1>
          </main>
        </MainTemplate>
      )}
    </Authenticator>
    </div>
    </div>  
  );
}