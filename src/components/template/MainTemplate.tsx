import React, { ReactNode } from "react";
import { NavigationButtons } from "./NavigationButtons";
import { MenuOptions } from "./MenuOptions";
import { NotificationIcon } from "./NotificaitonIcon";

type MainTemplateProps = {
  children: ReactNode;
  currentNavigation: number;
};

const MainTemplate: React.FC<MainTemplateProps> = ({
    children,
    currentNavigation
    }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add your header component here */}
      <header className="w-full">
        <div className="flex flex-row justify-between mx-4">
          <NavigationButtons current={currentNavigation} />
          <NotificationIcon/>
          <MenuOptions />
        </div>
      </header>

      <main className="p-4 w-full flex-grow mr-44 mb-12">{children}</main>
    </div>
  );
};

export default MainTemplate;
