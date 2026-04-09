import React from "react";
import { Navbar } from "./Navbar";

type PageLayoutProps = {
  children: React.ReactNode;
  bgColor?: string;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  bgColor = "bg-backgroundLight",
}) => {
  return (
    <div className={`${bgColor} min-h-screen w-screen flex flex-col`}>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};
