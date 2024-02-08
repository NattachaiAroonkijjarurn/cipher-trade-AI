import React from "react";
import Sidebar from "./sidebar";
import { useRoutes } from "react-router-dom";
import Home from "../pages/Home"

function RootLayout({ children }) {

  // Check if the current page is Home
  const isHomePage = useRoutes([
    { path: "/", element: <Home /> },
  ]);

  return (
    <div className={isHomePage ? "flex flex-auto" : "flex flex-auto gap-5"}>
      <Sidebar />
      <main className={isHomePage ? "text-white flex-1 mx-1 py-1" : "text-white flex-1 mx-5 py-4"} id="page">{children}</main>
    </div>
  );
}

export default RootLayout;