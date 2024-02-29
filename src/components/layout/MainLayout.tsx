"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SideNav from "./SideNav";
import Header from "./Header";

export default function MainLayout({
  children,
  hideHeader = false,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const route = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <main className="transition-all h-screen overflow-hidden w-full bg-purple-500">
      <div
        className={`fixed top-0 left-0 h-full bg-purple-500 text-white w-48 transition-all duration-300 ease-in-out z-50 pt-6 pl-2 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {!hideHeader && <SideNav />}
      </div>
      <div className={`fixed top-0 w-full z-50 ${menuOpen ? "ml-48" : ""}`}>
        {!hideHeader && <Header setOpenMenu={toggleMenu} />}
      </div>
      <div className={` ${menuOpen ? "ml-48" : ""} `}>{children}</div>
    </main>
  );
}
