
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify';
import outputs from "../amplify_outputs.json"

Amplify.configure(outputs);

// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";

import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login.tsx";
import { HomePage } from "../pages/Home.tsx";
import { Secret } from "../pages/Secret.tsx";
import { ProfilePage } from "../pages/Profile.tsx";
import { JobPage } from "../pages/Jobs.tsx";


import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/useAuth.js";

// const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }
    
  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }
  // const { route } = useAuthenticator(context => [context.route]);

  return ( 
  <Authenticator.Provider>
    {/* <Authenticator> */}
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute> <ProfilePage /></ProtectedRoute>} />
      <Route path="/secret" element ={<ProtectedRoute> <Secret/> </ProtectedRoute>}/>
      <Route path="/jobs" element ={<ProtectedRoute> <JobPage/> </ProtectedRoute>}/>
    </Routes>
    </AuthProvider>
    {/* </Authenticator> */}
  </Authenticator.Provider>
  //   <Authenticator>
  //     {({ signOut, user }) => ( 
  //   <main>
  //     <h1>{user?.signInDetails?.loginId}'s todos</h1>
  //     <h1>My todos</h1>
  //     <button onClick={createTodo}>+ new</button>
  //     <ul>
  //       {todos.map((todo) => (
  //         <li  
  //         onClick={() => deleteTodo(todo.id)}
  //         key={todo.id}>{todo.content}</li>
  //       ))}
  //     </ul>
  //     <div>
  //       🥳 App successfully hosted. Try creating a new todo.
  //       <br />
  //       <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
  //         Review next step of this tutorial.
  //       </a>
  //     </div>
  //     <button onClick={signOut}>Sign out</button>
  //   </main>   
  //     )}
  //     </Authenticator>
  );
}

export default App;
