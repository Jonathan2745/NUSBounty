import { NavigationButtons } from "../src/components/NavigationButtons";
import { Button } from "@aws-amplify/ui-react";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

export const Secret = () => {
  const client = generateClient<Schema>();
  const { user } = useAuthenticator((context) => [context.user]);
  const [currentUser, setCurrentUser] = useState<Schema["User"]["type"] | null>(null);

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


    
    if (currentUser) {
      const currentBalance = currentUser.data?.walletBalance;
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
  // useEffect(() => {
  //   const sub = client.models.User.observeQuery().subscribe({
  //     next:({ items }) => {
  //       setBalance([...items]);
  //     },
  //   });
  //   return () => sub.unsubscribe();
  // }, []);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Wallet Test Page</h1>
      <Button onClick={() => changeBalance(1234567)}> Test Balance 1234567 </Button>
      <ul className="text-white flex"> Wallet Balance: { currentUser ? currentUser.walletBalance : "ERROR 404 NO USER LOGGED IN" }
      </ul>
      {/* // make this button add 2$ to the current users wallet // */}
      <Button loadingText="" onClick={() => changeBalance(2)}> Give me $2 </Button>
            {/* // make this button remove 2$ from the current users wallet // */}
      <Button loadingText="" onClick={() => changeBalance(-2)}> Steal me $2 </Button>

      <NavigationButtons />
    </div>
  );
};