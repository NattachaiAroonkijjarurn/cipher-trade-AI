import React from "react";
import Sidebar from "./sidebar";

function RootLayout({ children }) {

  // Check if the current page is Home
  const isHomePage = useRoutes([
    { path: "/", element: <Home /> },
  ]);

  return (
    <div className="flex flex-auto gap-5">
      <Sidebar />
      <main className="text-white  flex-1  mx-5 py-4">{children}</main>
    </div>
  );
}

export default RootLayout;