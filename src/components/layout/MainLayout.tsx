"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SvgSpinner } from "app/icons/icons";
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
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [preventiusSubMenuOpen, setPreventiusSubMenuOpen] = useState(false);
  const [historicSubMenuOpen, setHistoricSubMenuOpen] = useState(false);
  const [correctiveSubMenuOpen, setCorrectiveSubMenuOpen] = useState(false);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const route = usePathname();

  const toggleHistoricSubMenu = () => {
    setHistoricSubMenuOpen(!historicSubMenuOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const togglePreventiusSubMenu = () => {
    setPreventiusSubMenuOpen(!preventiusSubMenuOpen);
  };

  const toggleCorrectiveSubMenu = () => {
    setCorrectiveSubMenuOpen(!correctiveSubMenuOpen);
  };

  const handleLinkClick = (key: string) => {
    setLoadingKey(key === loadingKey ? null : key);
    if (route.includes(key)) {
      setLoadingKey(key === loadingKey ? null : null);
      setMenuOpen(false);
      setSubMenuOpen(false);
      setPreventiusSubMenuOpen(false);
      setCorrectiveSubMenuOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-purple-500 text-black relative overflow-hidden">
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
