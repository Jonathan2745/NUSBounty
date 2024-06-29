
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login.jsx";
import { HomePage } from "../pages/Home.jsx";
import { Secret } from "../pages/Secret.jsx";
import { ProfilePage } from "../pages/Profile.jsx";


import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }
    
  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }

  return (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProtectedRoute> <ProfilePage /></ProtectedRoute>} />
      <Route path="/secret" element ={<ProtectedRoute> <Secret/> </ProtectedRoute>}/>
    </Routes>
  </AuthProvider>
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
