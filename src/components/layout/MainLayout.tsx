'use client';

import React, { useEffect, useState } from 'react';
import Loader from 'components/Loader/loader';
import Link from 'next/link';

import Header from './Header';
import SideNav from './SideNav';

export default function MainLayout({
  children,
  hideHeader = false,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedMenuOpen = localStorage.getItem('menuOpen') === 'true';
    setMenuOpen(savedMenuOpen);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prevState => {
      const newState = !prevState;
      localStorage.setItem('menuOpen', String(newState));
      return newState;
    });
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div
          className={`fixed mt-2 top-0 left-0 h-full bg-white text-white transition-all duration-400 ease-in-out z-50 pt-6 ${
            menuOpen ? 'pl-3 w-60' : !hideHeader && !menuOpen && 'w-16'
          }`}
        >
          {!hideHeader && (
            <SideNav setOpenMenu={toggleMenu} menuOpen={menuOpen} />
          )}
        </div>

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <div className={`fixed top-0 w-full z-50 ${menuOpen ? '' : ''}`}>
            {!hideHeader && <Header setOpenMenu={toggleMenu} />}
          </div>
          <main className="flex-1 bg-okron-background">
            <div
              className={`mx-auto max-w-screen-3xl min-h-screen ${
                menuOpen ? 'ml-60' : 'ml-16'
              } `}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
      {!hideHeader && (
        <footer
          className={`${menuOpen ? 'ml-60' : 'ml-16'} bg-okron-background`}
        >
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
    </div>
  );
}
