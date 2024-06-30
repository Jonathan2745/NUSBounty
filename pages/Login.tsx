// import { useState } from "react";
// import { useAuth } from "../src/hooks/useAuth.tsx";

// export const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     // Here you would usually send a request to your backend to authenticate the user
//     // For the sake of this example, we're using a mock authentication
//     if (username === "user" && password === "password") {
//       // Replace with actual authentication logic
//       await login({ username });
//     } else {
//       alert("Invalid username or password");
//     }
//   };
//   return (
//     <div>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input
//             id="username"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };



// import React, { useState } from "react";
// import { useAuth } from "../src/hooks/useAuth";

// // Define the User interface
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   username: string;
//   // Add other properties as needed
// }

// export const LoginPage: React.FC = () => {
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const { login } = useAuth();

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Here you would usually send a request to your backend to authenticate the user
//     // For the sake of this example, we're using a mock authentication
//     if (username === "user" && password === "password") {
//       // Replace with actual authentication logic
//       const user1 : User = {
//         id: "1",
//         name: "John",
//         email: "tocrauta@gmail.com",
//         username
//       }
//       await login( user1 as User );
//     } else {
//       alert("Invalid username or password");
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input
//             id="username"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };


import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import React from "react";
import { NavigationButtons } from '../src/components/NavigationButtons';



Amplify.configure(outputs);

export const LoginPage: React.FC = () => {

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