// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
// import React, { useEffect, useState } from "react";
// import { useAuthenticator } from '@aws-amplify/ui-react';
// import { generateClient } from 'aws-amplify/api';
// import { type Schema } from '../amplify/data/resource';
// import { useNavigate } from 'react-router-dom';


// const client = generateClient<Schema>();

// export const LoginPage: React.FC = () => {
//   const { user } = useAuthenticator((context) => [context.user]);

//   const checkandCreateUser = async() => {
//     try {
//       const userid = user?.userId;
//       const username = user?.username;
//       const currentUser = await client.models.User.get({
//         userId: userid,
//       })

//       if (!currentUser || !Object.keys(currentUser.data ?? {}).length){
//         await client.models.User.create({
//           userId: userid,
//           username: username,
//           walletBalance: 0,
//         })
//         console.log("created user");
//       } else {
//         console.error("error creating user/ user already found");
//       }

//     } catch (error) {
//       console.error("error creating or checking current user", error );
//     }
//   }

//   useEffect(() => {
//     if (user) {
//       checkandCreateUser();
//       console.log( "Checked and created user", user);
//     } else {
//       console.error("no such user created");
//     }
//   }, [user]);

  

//   const navigate = useNavigate();
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [userUsername, setUserUsername] = useState("");

//   useEffect(() => {
//     if (userUsername) {
//       const timer = setTimeout(() => {
//         setShowWelcome(false);
//         navigate('/home');
//       }, 1500);

//       return () => clearTimeout(timer);
//     }
//   }, [userUsername, navigate]);


//   return (
//     <div className='flex flex-col justify-center items-center min-h-screen min-w-full'>
//       <h1 className="text-5xl mb-6 font-semibold"> Welcome to NUSBounty </h1>
    
//       <Authenticator>
//         {({ user }) => {
//           if (user && !userUsername) {
//             setUserUsername(user.signInDetails?.loginId ?? "");
//           }
//           return (
//               <main>
//                 {showWelcome && <h1>Hello {userUsername}</h1>}
//               </main>
//           );
//         }}
//       </Authenticator>
//     </div>
//   );
// };

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
        walletBalance: 0,
      });
      console.log("Created user");
    } else {
      console.log("User already exists");
    }
  } catch (error) {
    console.error("Error creating or checking current user", error);
  }
};

export const LoginPage: React.FC = () => {
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
