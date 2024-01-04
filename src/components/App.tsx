import { ReactNode, useState } from "react";
import "../../src/global.css";
import Head from "next/head";
import Link from "next/link";

export default function Html({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [preventiusSubMenuOpen, setPreventiusSubMenuOpen] = useState(false);
  const [historicSubMenuOpen, setHistoricSubMenuOpen] = useState(false);

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

  return (
    <main className="min-h-screen h-100 bg-slate-300 flex">
      <div className="relative w-full max-w-full overflow-hidden">
        <div
          className={`absolute inset-0 bg-gray-800 text-white w-48 transition-all duration-300 ease-in-out z-50 transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 text-white font-semibold">Username : Jordi</div>
          <nav className="my-4">
            <>
              <Link className="flex items-center border-x-2 px-2 py-1" href="/">
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Inici
              </Link>
              <div
                onClick={toggleSubMenu}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Màquines
                <svg
                  className={`h-4 w-4 ml-auto transform ${
                    subMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {subMenuOpen && (
                <div className="ml-4">
                  <Link
                    className="block px-4 py-2 hover:bg-gray-700"
                    href="/machines"
                  >
                    Configuració
                  </Link>
                  {/*  <Link
                      className="block px-4 py-2 hover:bg-gray-700"
                      href="/sections"
                    >
                      Seccions
                    </Link>*/}
                </div>
              )}
              <div
                onClick={togglePreventiusSubMenu}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Preventius
                <svg
                  className={`h-4 w-4 ml-auto transform ${
                    preventiusSubMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {preventiusSubMenuOpen && (
                <div className="ml-4">
                  <Link
                    className="block px-4 py-2 hover:bg-gray-700"
                    href="/preventive"
                  >
                    Configuració
                  </Link>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-700"
                    href="/inspectionPoints"
                  >
                    Punts d'Inspecció
                  </Link>
                </div>
              )}

              <div
                onClick={toggleHistoricSubMenu}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Ordres de treball
                <svg
                  className={`h-4 w-4 ml-auto transform ${
                    historicSubMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                  xmlns="https://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {historicSubMenuOpen && (
                <div className="ml-4">
                  <Link
                    className="block px-4 py-2 hover:bg-gray-700"
                    href="/historic"
                  >
                    Configuració
                  </Link>
                  <Link
                    className="block px-4 py-2 hover:bg-gray-700"
                    href="/machineWorkOrders"
                  >
                    Històric
                  </Link>
                </div>
              )}
              <Link
                className="flex items-center border-r-2 px-2 py-1"
                href="/operators"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Operaris
              </Link>
              <Link
                className="flex items-center border-r-2 px-2 py-1"
                href="/spareParts"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Recanvis
              </Link>
            </>
          </nav>
        </div>

        <div
          className={`flex-1 transition-all duration-300 ${
            menuOpen ? "ml-48" : "ml-0"
          }`}
        >
          <header className="flex bg-purple-400 items-center justify-start text-lg font-semibold text-white p-4">
            <button
              className="text-white focus:outline-none flex items-center"
              onClick={toggleMenu}
            >
              {menuOpen ? (
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
