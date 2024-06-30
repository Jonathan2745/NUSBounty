// import React, { useState, useEffect } from "react";
// import { useAuth } from "../src/hooks/useAuth.tsx";
// import { useNavigate } from "react-router-dom";
// import { uploadData } from "aws-amplify/storage";

// export const ProfilePage = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const [shouldNavigate, setShouldNavigate] = useState(0);

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
//     if (shouldNavigate == 1) {
//       navigate("/secret");
//     }
//     if (shouldNavigate == 2) {
//       navigate("/home");
//     }
//   }, [shouldNavigate, navigate]);


//   return (
//     <div>
//       <h1>This is a Profile page</h1>
//       <button onClick={handleLogout}>Logout</button>
//       <button onClick={handleSecrets}>Secrets</button>
//       <button onClick={handleHome}>Home</button>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import { useAuth } from "../src/hooks/useAuth"; // Adjust the path if necessary
import { useNavigate } from "react-router-dom";
import { uploadData } from 'aws-amplify/storage';

export const ProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleSecrets = () => {
    setShouldNavigate(1);
  };

  const handleHome = () => {
    setShouldNavigate(2);
  };

  useEffect(() => {
    if (shouldNavigate === 1) {
      navigate("/secret");
    } else if (shouldNavigate === 2) {
      navigate("/home");
    }
  }, [shouldNavigate, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      uploadData({
        path: `picture-submissions/${file.name}`,
        data: file,
      })
    } else {
      alert("No file selected");
    }
  };

  return (
    <div>
      <h1>This is a Profile page</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleSecrets}>Secrets</button>
      <button onClick={handleHome}>Home</button>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};
