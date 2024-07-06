import { NavigationButtons } from "../src/components/NavigationButtons";
import { Button } from "@aws-amplify/ui-react";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";


export const Secret = () => {
  const client = generateClient<Schema>();
  const [wallet, setBalance] = useState<Schema["User"]["type"][]>([]);

  const changeBalance = async () => {
    await client.models.User.create({
      walletBalance: 20,
    })
  };

  useEffect(() => {
    const sub = client.models.User.observeQuery().subscribe({
      next:({ items }) => {
        setBalance([...items]);
      },
    });
    return () => sub.unsubscribe();
  }, []);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Wallet Test Page</h1>
      <h2> wallet balance: 0</h2>
      <button onClick={changeBalance}> Test Balance </button>
      <ul>
       {wallet.map(({id, walletBalance }) => (
          <li key={id}>{walletBalance}</li>
        ))}
      </ul>
      <Button loadingText="" onClick={() => alert('Not Implemented Yet~! ')}> Click me! </Button>
      <NavigationButtons />
    </div>
  );
};