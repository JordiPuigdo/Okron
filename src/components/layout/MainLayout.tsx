"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SideNav from "./SideNav";
import Header from "./Header";
import Link from "next/link";

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
          className={`fixed top-0 left-0 h-full bg-white text-white w-60 transition-all duration-400 ease-in-out z-50 pt-6 pl-2 transform ${
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
          <main className="flex-1 bg-gray-300">
            <div
              className={`mx-auto max-w-screen-3xl min-h-screen ${
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
      {!hideHeader && (
        <footer className={`${menuOpen ? "ml-60" : ""} bg-gray-300`}>
          <div className="flex max-w-screen-xl2 md:p-4 2xl:p-4 border-t-2 border-gray-200 text-gray-600 mx-6">
            <div className="w-full">
              <p>Copyright © 2024 Okron AI Business</p>
            </div>
            <div className="w-full text-end">
              <Link href="https://www.okron.io/" className="text-blue-800">
                Okron
              </Link>
            </div>
          </div>
        </footer>
      )}
      {/* <!-- ===== Footer End ===== --> */}
    </div>
  );
}
