import React, { ReactNode } from "react";
import { NavigationButtons } from "./NavigationButtons";
import { MenuOptions } from "./MenuOptions";
import { NotificationIcon } from "./NotificaitonIcon";
import { Image } from "@aws-amplify/ui-react";
import mimic from "../../src/assets/Icons/mimic.png"

type MainTemplateProps = {
  children: ReactNode;
  currentNavigation: string;
};

const MainTemplate: React.FC<MainTemplateProps> = ({
    children,
    currentNavigation
    }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Add your header component here */}
      <header className="w-full">
        <div className="flex flex-row justify-between mx-4 items-start gap-36">
          <div className= "flex flex-row items-center gap-4">
          <Image
              alt="NUSBounty logo"
              src={mimic}
              objectFit="initial"
              objectPosition="50% 50%"
              backgroundColor="initial"
              height="auto"
              width="6rem"
              opacity="100%"
              onClick={() => alert("/home")}
            />
            <h1 className="font-light text-3xl">NUS B&#10683;unty</h1>
          </div>
          <div className= "flex flex-row flex-grow justify-between">
          <NavigationButtons current={currentNavigation} />
          <div className="flex flex-row gap-1 items-stretch my-6">
            <NotificationIcon/>
            <MenuOptions />
          </div>
        </div>
        </div>
      </header>

      <main className="p-4 w-full flex-grow mr-44 mb-12 flex flex-col">{children}</main>
    </div>
  );
};

export default MainTemplate;
