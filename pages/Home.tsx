import { NavigationButtons } from "../src/components/NavigationButtons";
import type { Schema } from '../amplify/data/resource';
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";


export const HomePage = () => {
  const client = generateClient<Schema>();
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  

  useEffect (() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content ?"),
      isDone: false,
    });

  }
  
  return ( 
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Home Page</h1>
      <button onClick={createTodo}> Add new Todo </button>
      <ul>
        {todos.map(({id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
      <NavigationButtons />
    </div>
  );
};



