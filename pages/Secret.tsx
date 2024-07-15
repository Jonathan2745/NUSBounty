import { NavigationButtons } from "../src/components/NavigationButtons";
import { Button } from "@aws-amplify/ui-react";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";


export const Secret = () => {
  const client = generateClient<Schema>();
  const { user } = useAuthenticator((context) => [context.user]);
  type User = Schema['User']['type'];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // type WalletBalance = Schema['Jobs']['type'];
  const [balance, setWalletBalance] = useState<number | null>(null);

  const fetchWalletBalance = async() => {
    if (currentUser && currentUser.walletBalance){
      const currentBalance = currentUser.walletBalance;
      setWalletBalance(currentBalance);

    } else {
      console.error('Failed to set Balance');
    }
  }

  useEffect(() => {
    const sub = client.models.User.observeQuery().subscribe({
      next:({ items }) => {
        const fetchedUser = items.find(item => item.userId === user?.userId);
        if (fetchedUser) {
          setCurrentUser(fetchedUser);
        }
      },
      error: (error) => {
        console.error("Error observing user query", error);
      }
    });
    return () => sub.unsubscribe();
  }, [user]);


  const fetchCurrentUser = async() => {
    if (user){
      try {
        const { data: CurrentUserData } = await client.models.User.get({
            userId:  user.userId
        }) 

        if ( CurrentUserData ){
          setCurrentUser( CurrentUserData );
        } else {
          console.error("Error fetching current user: big problemm");

        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
  }

   const changeBalance = async (amount: number) => {
    const currentUser = await client.models.User.get({
      userId: user.userId,
    })
    
    if ( user && currentUser) {
      const currentBalance = currentUser.data?.walletBalance ?? 0;
      const updatedUser = {
        userId: user.userId,
        walletBalance: currentBalance ? currentBalance + amount : amount,
      };

      try {
        await client.models.User.update(updatedUser);
        console.log( "balance Changed", {amount}, "current Balance", {currentBalance});

      } catch (error) {
        console.error("Error updating balance:", error);
      }
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [user]);

  useEffect(() => {
    fetchWalletBalance();
  }, [currentUser, currentUser?.walletBalance])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Wallet Test Page</h1>

      <h1 className="text-5xl mb-6 font-semibold">This Page is inteded for the testing and bug fixing of wallet related modules/ features</h1>

      <Button onClick={() => changeBalance(1234567)}> Test Balance 1234567 </Button>
      <ul className="text-white flex"> Wallet Balance: { balance }
      </ul>
      {/* // make this button add 2$ to the current users wallet // */}
      <Button loadingText="" onClick={() => changeBalance(2)}> Give me $2 </Button>
            {/* // make this button remove 2$ from the current users wallet // */}
      <Button loadingText="" onClick={() => changeBalance(-2)}> Steal me $2 </Button>

      <NavigationButtons />
    </div>
  );
};