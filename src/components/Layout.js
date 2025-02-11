import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pb-16 md:pb-0">{children}</div> {/* Add padding-bottom for Navbar */}
      <Navbar />
    </div>
  );
};

export default Layout;
