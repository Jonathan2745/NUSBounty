import { NavigationButtons } from "../src/components/NavigationButtons";


export const Secret = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Wallet Test Page</h1>
      <NavigationButtons />
    </div>
  );
};