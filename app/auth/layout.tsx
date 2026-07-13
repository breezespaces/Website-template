import HomeNavBar from "@/components/NavBar";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-background font-sans antialiased flex flex-col items-center justify- min-h-screen">
      <HomeNavBar />
      <div className="w-full max-w-lg mt-9 mb-20 flex-1 flex justify-center items-center h-full">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
