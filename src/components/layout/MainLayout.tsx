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
    <div className="min-h-screen flex flex-col">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex flex-1">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <div
          className={`fixed top-0 left-0 h-full bg-white text-white w-60 transition-all duration-300 ease-in-out z-50 pt-6 pl-2 transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {!hideHeader && <SideNav setOpenMenu={toggleMenu} />}
        </div>
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <div className={`fixed top-0 w-full z-50 ${menuOpen ? "" : ""}`}>
            {!hideHeader && <Header setOpenMenu={toggleMenu} />}
          </div>
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1 pt-16">
            <div
              className={`mx-auto max-w-screen-3xl py-14 md:p-6 2xl:p-10  ${
                menuOpen ? "ml-60" : ""
              } `}
            >
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}

      {/* <!-- ===== Footer Start ===== --> */}
      <footer className="bg-white">
        <div className="flex mx-auto max-w-screen-xl2 md:p-6 2xl:p-4 justify-end">
          <p>Copyright © 2024 Okron Companie</p>
        </div>
      </footer>
      {/* <!-- ===== Footer End ===== --> */}
    </div>
  );
}
