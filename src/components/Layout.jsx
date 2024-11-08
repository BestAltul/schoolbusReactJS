import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
