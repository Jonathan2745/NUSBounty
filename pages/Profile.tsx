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
import mimic from "../src/assets/Icons/mimic.png"

const client = generateClient<Schema>();

const ProfilePage: React.FC = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [file, setFile] = useState<File | null>(null);
  const [identityId, setIdentityId] = useState<string | null>(null);

  type User = Schema['User']['type'];

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [currentBio, setCurrentBio] = useState<string>('');
  const [newBio, setNewBio] = useState<string>('');
  const [editBio, setEditBio] = useState<boolean>(false);

  const acceptedFileTypes = ['image/png', 'image/jpeg'];
  const hiddenInput = useRef<HTMLInputElement | null>(null);




  const updateUsername = async ( usernamenew: string ) => {
    if (currentUser && usernamenew) {
      try {
        const updatedUser = {
          userId: currentUser.userId,
          username: usernamenew,
        };
        await client.models.User.update(updatedUser);
        setCurrentUsername(usernamenew);
        setToggleEdit(false);
      } catch (error) {
        console.log("Error updating username", error);
      }
    } else {
      alert("Username not inputted or no current user found");
    }
  };

  const fetchBio = async  () => {
    if ( currentUser ){
      if ( currentUser.bio ){
        setCurrentBio(currentUser.bio);
      } else {
        setCurrentBio("No Bio Yet!");
      }
    }
  }

  const updateBio = async ( bionew:string) => {
    setEditBio(false);
    if (currentUser) {
      try {
        const updatedUser = {
          userId: currentUser.userId,
          bio: bionew,
        };
        await client.models.User.update(updatedUser);
        if (bionew) {
          setCurrentBio(bionew);
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
    fetchCurrentUsername();
  }, []);

  useEffect(() => {
    fetchBio();
  }, [currentUser]);

  useEffect(() => {
    const fetchIdentityId = async () => {
      try {
        if (user && user.signInDetails?.loginId) {
          const identityId = user.signInDetails.loginId;
          setIdentityId(identityId);
          console.log("Fetched IdentityId: ", identityId);
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
          path: `public/${user.userId}`,
          data: file
        });
        // end loading //
        console.log("File uploaded successfully! to", user.userId);
      } catch (error) {
        console.error("Error uploading file: ", error, user.userId);
        alert("File upload failed. Please try again.");
      }
    } else {

      toast.error("No file selected !", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
              path={`public/${user.userId}`}
              fallbackSrc= {mimic}
              onGetUrlError={(error) => console.error(error)}
            />
            {/* <img src="src/assets/icons/mimic.png" className="w-64 self-center rounded-full border-2" alt="Profile" /> */}
            <DropZone
              acceptedFileTypes={['image/jpeg']}
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
                  {toggleEdit && <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} /> }
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
                {editBio && <Input value={newBio} onChange={(e) => setNewBio(e.target.value)} /> }
                </td>
              </tr>
            </table>
            {!toggleEdit && <Button onClick={()=>setToggleEdit(true)}>Edit Username</Button>}
            {toggleEdit &&
            <>
              <Button onClick={()=>setToggleEdit(false)}>Cancel</Button>
              <Button onClick ={() => updateUsername(newUsername)} >Submit</Button>
            </>
            }
            {!editBio && <Button onClick={() => setEditBio(true)}>Edit Bio</Button>}
            {editBio &&
              <>
                <Button onClick={() => setEditBio(false)}>Cancel</Button>
                <Button onClick={ () => updateBio(newBio)}>Submit</Button>
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


// import React, { useState, useEffect, useRef } from "react";
// import { DropZone, useAuthenticator, Text, VisuallyHidden, Button, Input } from "@aws-amplify/ui-react";
// import { uploadData } from "aws-amplify/storage";
// import '@aws-amplify/ui-react/styles.css';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import MainTemplate from "../src/components/template/MainTemplate";
// import { type Schema } from '../amplify/data/resource';
// import { generateClient } from 'aws-amplify/api';

// import { StorageImage } from "@aws-amplify/ui-react-storage";
// import mimic from "../src/assets/Icons/mimic.png";

// const client = generateClient<Schema>();

// const ProfilePage: React.FC = () => {
//   const { user } = useAuthenticator((context) => [context.user]);
//   const [file, setFile] = useState<File | null>(null);
//   const [identityId, setIdentityId] = useState<string | null>(null);

//   type User = Schema['User']['type'];
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [currentUsername, setCurrentUsername] = useState<string>('');
//   const [newUsername, setNewUsername] = useState<string>('');
//   const [toggleEdit, setToggleEdit] = useState<boolean>(false);
//   const [currentBio, setCurrentBio] = useState<string>('');
//   const [newBio, setNewBio] = useState<string>('');
//   const [editBio, setEditBio] = useState<boolean>(false);

//   const acceptedFileTypes = ['image/png', 'image/jpeg'];
//   const hiddenInput = useRef<HTMLInputElement | null>(null);

//   const fetchBio = async () => {
//     if (currentUser) {
//       setCurrentBio(currentUser.bio || "No Bio Yet!");
//     }
//   }

//   const updateBio = async () => {
//     if (currentUser && newBio) {
//       try {
//         const updatedUser = {
//           userId: currentUser.userId,
//           bio: newBio,
//         };
//         await client.models.User.update(updatedUser);
//         setCurrentBio(newBio);
//         setEditBio(false);
//       } catch (error) {
//         console.log("Error updating biography", error);
//       }
//     } else {
//       alert("Biography not inputted or no current user found");
//     }
//   };

//   const updateUsername = async () => {
//     if (currentUser && newUsername) {
//       try {
//         const updatedUser = {
//           userId: currentUser.userId,
//           username: newUsername,
//         };
//         await client.models.User.update(updatedUser);
//         setCurrentUsername(newUsername);
//         setToggleEdit(false);
//       } catch (error) {
//         console.log("Error updating username", error);
//       }
//     } else {
//       alert("Username not inputted or no current user found");
//     }
//   };

//   const fetchCurrentUser = async () => {
//     if (user) {
//       const { data: currentUser, errors } = await client.models.User.get({
//         userId: user.userId,
//       });
//       if (errors) {
//         console.error("User not found");
//       } else {
//         setCurrentUser(currentUser);
//       }
//     } else {
//       console.error("No user found");
//     }
//   };

//   useEffect(() => {
//     loadingUser();
//     fetchCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (currentUser) {
//       fetchBio();
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchIdentityId = async () => {
//       try {
//         if (user && user.signInDetails?.loginId) {
//           const identityId = user.signInDetails.loginId;
//           setIdentityId(identityId);
//         }
//       } catch (error) {
//         console.error("Error fetching user identity ID:", error);
//       }
//     };

//     fetchIdentityId();
//   }, [user]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleDrop = (acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       setFile(acceptedFiles[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (file && identityId) {
//       try {
//         await uploadData({
//           path: `public/${user.userId}`,
//           data: file
//         });
//         console.log("File uploaded successfully!");
//       } catch (error) {
//         console.error("Error uploading file: ", error);
//         alert("File upload failed. Please try again.");
//       }
//     } else {
//       toast.error("No file selected!", {
//         position: "top-center",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "light",
//       });
//     }
//   };

//   const loadingUser = () => {
//     toast('Loading user...', {
//       position: "top-center",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "light",
//     });
//   };

//   return (
//     <MainTemplate currentNavigation={"profile"}>
//       <div className="flex flex-col items-center justify-center flex-grow gap-2">
//         <h1 className="text-5xl mb-6 font-semibold">Profile</h1>
//         <div className="flex flex-row justify-center gap-8">
//           <div className="flex flex-col gap-3 justify-center">
//             <StorageImage
//               className="w-64 self-center rounded-full border-2"
//               alt="Profile Picture"
//               path={`public/${user.userId}`}
//               fallbackSrc={mimic}
//               onGetUrlError={(error) => console.error(error)}
//             />
//             <DropZone
//               acceptedFileTypes={['image/jpeg']}
//               onDropComplete={({ acceptedFiles }) => handleDrop(acceptedFiles)}
//               className="p-0"
//             >
//               <Button className="border-0 w-full h-full text-gray-400 text-2xl font-thin p-0 pt-1 pb-2" onClick={() => hiddenInput.current?.click()}>
//                 +
//               </Button>
//               <VisuallyHidden>
//                 <input
//                   type="file"
//                   tabIndex={-1}
//                   ref={hiddenInput}
//                   onChange={handleChange}
//                   accept={acceptedFileTypes.join(',')}
//                 />
//               </VisuallyHidden>
//             </DropZone>
//             {file && <Text key={file.name}>{file.name}</Text>}
//             <Button onClick={handleUpload}>Upload</Button>
//           </div>
//           <div className="flex flex-col justify-center border-2 rounded-xl p-5 gap-3">
//             <table className="font-semibold">
//               <tbody>
//                 <tr>
//                   <td className="text-right">Username: </td>
//                   <td className="text-left">
//                     {!toggleEdit ? (
//                       <>
//                         {currentUsername}
//                         <Button onClick={() => setToggleEdit(true)}>Edit</Button>
//                       </>
//                     ) : (
//                       <>
//                         <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
//                         <Button onClick={updateUsername}>Submit</Button>
//                         <Button onClick={() => setToggleEdit(false)}>Cancel</Button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="text-right">Email: </td>
//                   <td className="text-left">{identityId}</td>
//                 </tr>
//                 <tr>
//                   <td className="text-right">Biography: </td>
//                   <td className="text-left">
//                     {!editBio ? (
//                       <>
//                         {currentBio}
//                         <Button onClick={() => setEditBio(true)}>Edit</Button>
//                       </>
//                     ) : (
//                       <>
//                         <Input value={newBio} onChange={(e) => setNewBio(e.target.value)} />
//                         <Button onClick={updateBio}>Submit</Button>
//                         <Button onClick={() => setEditBio(false)}>Cancel</Button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
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
//       />
//     </MainTemplate>
//   );
// };

// export default ProfilePage;




