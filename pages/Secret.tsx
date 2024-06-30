import { NavigationButtons } from "../src/components/NavigationButtons";
import { Button } from "@aws-amplify/ui-react";

export const Secret = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Wallet Test Page</h1>
      <h2> wallet balance: 0</h2>
      <Button loadingText="" onClick={() => alert('Not Implemented Yet~! ')}> Click me! </Button>
      <NavigationButtons />
    </div>
  );
};