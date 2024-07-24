
// import React, { useState, useEffect } from "react";
// import { useAuthenticator } from "@aws-amplify/ui-react";
// import { uploadData } from "aws-amplify/storage";
// import { StorageImage } from "@aws-amplify/ui-react-storage";
// import MainTemplate from "../src/components/template/MainTemplate.tsx";
// import { type Schema } from '../amplify/data/resource';
// import { generateClient } from 'aws-amplify/api';
// import { Button } from '@aws-amplify/ui-react';
// import { ToastContainer, toast } from "react-toastify";



// const client = generateClient<Schema>();

// export const ProfilePage: React.FC = () => {
//   const { user } = useAuthenticator((context) => [context.user]);
//   const [file, setFile] = useState<File | null>(null);
//   const [identityId, setIdentityId] = useState<string | null>(null);
  
  
//   type User = Schema['User']['type'];
//   const [ currentUser, setCurrentUser ] = useState<User | null>(null);
//   const [ currentUsername, setCurrentUsername] = useState<string>(user.username);

//   const setUsername = async () => {
//     const newUsername = prompt("Insert new username here : ");
//     if ( currentUser ){
//       try {
//         const updatedUser = {
//           userId: currentUser.userId,
//           username: newUsername,
//         }
//         await client.models.User.update(updatedUser);
//         if ( newUsername ){
//           setCurrentUsername(newUsername);
//         } else {
//           alert("username not inputted");
//           return;
//         }
//       } catch (error) {
//         console.log("error faced while updating username", error );
//       }
//     } else {
//       alert("no current user found");
//       return;
//     }
//   }



//   const fetchCurrentUser = async () => {
//     if (user) {
//         const { data: currentuser, errors } = await client.models.User.get({
//             userId: user.userId,
//         })
//         if ( errors ){
//             console.error("User not found");
//         } else {
//             try{ 
//                 setCurrentUser(currentuser);
//             } catch (error) {
//                 console.error("errror setting curent user", error);
//             }
//         }
//     } else {
//         console.error("No user found");
//     }
//   }

//   useEffect(() => {
//     loadinguser();
//     fetchCurrentUser();
//   }, []);



//   useEffect(() => {
//     loadinguser();
//     const fetchIdentityId = async () => {
//       try {
//         const identityId = user.userId;
//         setIdentityId(identityId);
//       } catch (error) {
//         console.error("Error fetching user identity ID:", error);
//       }
//     };

//     fetchIdentityId();
//   }, []);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files ? event.target.files[0] : null;
//     setFile(selectedFile);
//   };

//   const handleUpload = async () => {
//     if (file && identityId) {
//       try {
//         uploadData({
//           path: `public/${identityId}`,
//           data: file
//         });

//         alert("File uploaded successfully!");
//       } catch (error) {
//         console.error("Error uploading file: ", error);
//         alert("File upload failed. Please try again.");
//       }
//     } else {
//       alert("No file selected or user not authenticated");
//     }
//   };


//   // Toast Popup for loading in user //
//   const loadinguser = () =>{
//     toast('🦄 Wow so easy!', {
//       position: "top-right",
//       autoClose: 500,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//       });
//   };


//   return (
//     <MainTemplate currentNavigation={0}>
 
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <div className="m-12">
//           <h1 className="text-5xl mb-6 font-semibold">Profile</h1>
//           <StorageImage
//             alt="Profile Picture"
//             path={"public/cat.jpg"}
//           />
//           <input type="file" onChange={handleChange} />
//           <button
//             onClick={handleUpload}
//             className="bg-amplify-teal px-5 py-3 rounded-md text-white text-lg font-bold"
//           >
//             Upload
//           </button>
//         </div>
//         <Button onClick={setUsername}> set your username here ! </Button>
//         <h1> Current Username: {currentUsername}  </h1>
//       </div>
//       <ToastContainer
//         position="top-center"
//         autoClose={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable={false}
//         theme="light"
//         />
//     </MainTemplate>
//   );
// };


import React, { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import MainTemplate from "../src/components/template/MainTemplate.tsx";
import { type Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import { Button } from '@aws-amplify/ui-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const client = generateClient<Schema>();

export const ProfilePage: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [file, setFile] = useState<File | null>(null);
  const [identityId, setIdentityId] = useState<string | null>(null);

  type User = Schema['User']['type'];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>(user.username);

  const setUsername = async () => {
    const newUsername = prompt("Insert new username here: ");
    if (currentUser) {
      try {
        const updatedUser = {
          userId: currentUser.userId,
          username: newUsername,
        };
        await client.models.User.update(updatedUser);
        if (newUsername) {
          setCurrentUsername(newUsername);
        } else {
          alert("Username not inputted");
          return;
        }
      } catch (error) {
        console.log("Error faced while updating username", error);
      }
    } else {
      alert("No current user found");
      return;
    }
  };

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

  useEffect(() => {
    loadinguser();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchIdentityId = async () => {
      try {
        const identityId = user.userId;
        setIdentityId(identityId);
      } catch (error) {
        console.error("Error fetching user identity ID:", error);
      }
    };

    fetchIdentityId();
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file && identityId) {
      try {
        await uploadData({
          path: `public/${identityId}`,
          data: file
        });

        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert("File upload failed. Please try again.");
      }
    } else {
      alert("No file selected or user not authenticated");
    }
  };

  const loadinguser = () => {
    toast('Loading user...', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <MainTemplate currentNavigation={"profile"}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="m-12">
          <h1 className="text-5xl mb-6 font-semibold">Profile</h1>
          <StorageImage alt="Profile Picture" path={"public/cat.jpg"} />
          <input type="file" onChange={handleChange} />
          <button
            onClick={handleUpload}
            className="bg-amplify-teal px-5 py-3 rounded-md text-white text-lg font-bold"
          >
            Upload
          </button>
        </div>
        <Button onClick={setUsername}>Set your username here!</Button>
        <h1>Current Username: {currentUsername}</h1>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        theme="light"
      />
    </MainTemplate>
  );
};
