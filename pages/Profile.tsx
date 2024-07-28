import React, { useState, useEffect, useRef } from "react";
import { DropZone, useAuthenticator, Text, VisuallyHidden, Button, Input } from "@aws-amplify/ui-react";
// import { MdCheckCircle, MdFileUpload, MdRemoveCircle } from 'react-icons/md';
import { uploadData } from "aws-amplify/storage";
import '@aws-amplify/ui-react/styles.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainTemplate from "../src/components/template/MainTemplate";
import { type Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';

import { StorageImage } from "@aws-amplify/ui-react-storage";

const client = generateClient<Schema>();

const ProfilePage: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [file, setFile] = useState<File | null>(null);
  const [identityId, setIdentityId] = useState<string | null>(null);

  type User = Schema['User']['type'];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>();
  const [toggleEdit, setToggleEdit] = useState<boolean>(false)
  const [currentBio, setCurrentBio] = useState<string>();
  const [editBio, setEditBio] = useState<boolean>(false);


  const acceptedFileTypes = ['image/png', 'image/jpeg'];
  const hiddenInput = useRef<HTMLInputElement | null>(null);




  const fetchBio = async () => {
    if ( currentUser ){
      if ( currentUser.bio ){
        setCurrentBio(currentUser.bio);
      } else {
        setCurrentBio("No Bio Yet!");
      }
    }
  }

  
  const updateBio = async () => {
    const newBio = prompt("Insert new biography here: ", currentBio);
    if (currentUser) {
      try {
        const updatedUser = {
          userId: currentUser.userId,
          bio: newBio,
        };
        await client.models.User.update(updatedUser);
        if (newBio) {
          setCurrentBio(newBio);
        } else {
          alert("Biography not inputted");
          return;
        }
      } catch (error) {
        console.log("Error faced while updating biography", error);
      }
    } else {
      alert("No current user found");
      return;
    }
  };

  // const setUsername = async () => {
  //   const newUsername = prompt("Insert new username here: ");
  //   if (currentUser) {
  //     try {
  //       const updatedUser = {
  //         userId: currentUser.userId,
  //         username: newUsername,
  //       };
  //       await client.models.User.update(updatedUser);
  //       if (newUsername) {
  //         setCurrentUsername(newUsername);
  //       } else {
  //         alert("Username not inputted");
  //         return;
  //       }
  //     } catch (error) {
  //       console.log("Error faced while updating username", error);
  //     }
  //   } else {
  //     alert("No current user found");
  //     return;
  //   }
  // };

  const fetchCurrentUser = async () => {
    if (user) {
      const { data: currentUser, errors } = await client.models.User.get({
        userId: user.userId,
      });
      if (errors) {
        console.error("User not found");
      } else {
        try {
          setCurrentUser(currentUser);
        } catch (error) {
          console.error("Error setting current user", error);
        }
      }
    } else {
      console.error("No user found");
    }
  };

  const fetchCurrentUsername = async () => {
    if (currentUser && currentUser.username) {
      setCurrentUsername(currentUser.username);
    } else {
      setCurrentUsername("No username selected yet!");
    }
  }

  useEffect(() => {
    loadingUser();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchCurrentUsername();
    fetchBio();
  }, [currentUser]);

  useEffect(() => {
    const fetchIdentityId = async () => {
      try {
        if (user.signInDetails?.loginId) {
          const identityId = user.signInDetails.loginId.toString();
          setIdentityId(identityId);
        }
      } catch (error) {
        console.error("Error fetching user identity ID:", error);
      }
    };

    fetchIdentityId();
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (file && identityId) {
      try {
        // set loading //
        await uploadData({
          path: `public/${identityId}`,
          data: file
        });
        // end loading //
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert("File upload failed. Please try again.");
      }
    } else {
      alert("No file selected or user not authenticated");
    }
  };

  const loadingUser = () => {
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
      <div className="flex flex-col items-center justify-center flex-grow gap-2">
        <h1 className="text-5xl mb-6 font-semibold">Profile</h1>
        <div className="flex flex-row justify-center gap-8">
          <div className="flex flex-col gap-3 justify-center">
          <StorageImage className="w-64 self-center rounded-full border-2"
              alt=" Profile Picture"
              path={({ identityId }) => `protected/${identityId}.jpg`}
              fallbackSrc="default/mimic.png"
              onGetUrlError={(error) => console.error(error)}
            />
            {/* <img src="src/assets/icons/mimic.png" className="w-64 self-center rounded-full border-2" alt="Profile" /> */}
            <DropZone
              acceptedFileTypes={['image/*']}
              onDropComplete={({ acceptedFiles }) => handleDrop(acceptedFiles)}
              className="p-0"
            >
                <Button className="border-0 w-full h-full text-gray-400 text-2xl font-thin p-0 pt-1 pb-2" onClick={() => hiddenInput.current?.click()}>
                  +
                </Button>
              <VisuallyHidden>
                <input
                  type="file"
                  tabIndex={-1}
                  ref={hiddenInput}
                  onChange={handleChange}
                  accept={acceptedFileTypes.join(',')}
                />
              </VisuallyHidden>
            </DropZone>
            {file && <Text key={file.name}>{file.name}</Text>}
            <button
              onClick={handleUpload}>
              Upload
            </button>
          </div>
          <div className="flex flex-col justify-center border-2 rounded-xl p-5 gap-3">
            <table className="font-semibold">
              <tr>
                <td className="text-right">Username: </td>
                <td className="text-left">
                  {!toggleEdit && <>{currentUsername}</> }
                  {toggleEdit && <Input value={currentUsername}/> }
                </td>
              </tr>
              <tr>
                <td className="text-right">Email: </td>
                <td className="text-left">{identityId}</td>
              </tr>
              <tr>
                <td className="text-right">Biography: </td>
                <td className="text-left">
                {!editBio && <>{currentBio}</> }
                {editBio && <Input value={currentBio}/> }
                </td>
              </tr>
            </table>
            {!toggleEdit && <Button onClick={()=>setToggleEdit(true)}>Edit Username</Button>}
            {toggleEdit &&
            <>
              <Button onClick={()=>setToggleEdit(false)}>Cancel</Button>
              <Button>Submit</Button>
            </>
            }
            {!editBio && <Button onClick={() => setEditBio(true)}>Edit Bio</Button>}
            {editBio &&
              <>
                <Button onClick={() => setEditBio(false)}>Cancel</Button>
                <Button onClick={updateBio}>Submit</Button>
              </>
            }
          </div>
        </div>
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

export default ProfilePage;