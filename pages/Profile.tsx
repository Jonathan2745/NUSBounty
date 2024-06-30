

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../src/hooks/useAuth"; // Adjust the path if necessary
// import { useNavigate } from "react-router-dom";
// import { uploadData } from 'aws-amplify/storage';
// import { useAuthenticator } from '@aws-amplify/ui-react';

// export const ProfilePage: React.FC = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [shouldNavigate, setShouldNavigate] = useState<number | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const { user } = useAuthenticator((context) => [context.user]);

//   const handleLogout = () => {
//     logout();
//   };

//   const handleSecrets = () => {
//     setShouldNavigate(1);
//   };

//   const handleHome = () => {
//     setShouldNavigate(2);
//   };

//   useEffect(() => {
//     if (shouldNavigate === 1) {
//       navigate("/secret");
//     } else if (shouldNavigate === 2) {
//       navigate("/home");
//     }
//   }, [shouldNavigate, navigate]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files ? event.target.files[0] : null;
//     setFile(selectedFile);
//   };

//   const handleUpload = async () => {
//     if (file) {
//       uploadData({
//         path: ({identityId} => `picture-submissions/${identityId}.jpg`,
//         data: file,
//       })
//     } else {
//       alert("No file selected");
//     }
//   };

//   return (
//     <div>
//       <h1>This is a Profile page</h1>
//       <button onClick={handleLogout}>Logout</button>
//       <button onClick={handleSecrets}>Secrets</button>
//       <button onClick={handleHome}>Home</button>
//       <input type="file" onChange={handleChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { NavigationButtons } from "../src/components/NavigationButtons";

export const ProfilePage: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [file, setFile] = useState<File | null>(null);
  const [identityId, setIdentityId] = useState<string | null>(null);

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
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file && identityId) {
      try {
        uploadData({
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="m-12">
        <h1 className="text-5xl mb-6 font-semibold">Profile</h1>
        <StorageImage
          alt="Profile Picture"
          path={({ identityId }) =>  `public/${identityId}.jpg`}
        />
        <input type="file" onChange={handleChange} />
        <button
          onClick={handleUpload}
          className="bg-amplify-teal px-5 py-3 rounded-md text-white text-lg font-bold"
        >
          Upload
        </button>
      </div>
      <NavigationButtons />
    </div>
  );
};
