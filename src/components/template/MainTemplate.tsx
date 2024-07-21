import React, { ReactNode } from "react";
import { NavigationButtons } from "./NavigationButtons";
import { MenuOptions } from "./MenuOptions";

type MainTemplateProps = {
  children: ReactNode;
};

const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add your header component here */}
      <header className="w-full h-12">
        <div className="flex flex-row justify-end m-3 mb-0">
          <MenuOptions />
        </div>
      </header>

      <div className="flex-grow flex flex-row justify-center items-center">
        <div className="p-4 border-y-2 border-r-2 rounded-r-2xl border-slate-300 w-44">
          <NavigationButtons />
        </div>

        {/* Add your main content */}
        <main className="p-4 w-full flex-grow mr-44 mb-12">{children}</main>
      </div>
    </div>
  );
};

export default MainTemplate;
