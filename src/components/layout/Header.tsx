"use client";
import { useRouter } from "next/navigation";
import { useSessionStore } from "app/stores/globalStore";
import { useEffect, useState } from "react";
import useRoutes from "app/utils/useRoutes";

type Header = {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<Header> = ({ setOpenMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loginUser, operatorLogged, setLoginUser, setOperatorLogged } =
    useSessionStore((state) => state);
  const router = useRouter();
  const ROUTES = useRoutes();
  const handleMenuClick = () => {
    setOpenMenu(!menuOpen);
    setMenuOpen(!menuOpen);
  };

  function logOut() {
    setLoginUser(undefined);
    setOperatorLogged(undefined);
    router.push(ROUTES.home);
  }

  return (
    <header className="flex items-center justify-between bg-gradient-to-r from-purple-500 to-indigo-500 text-lg font-semibold text-white p-2 w-full sticky transition-all">
      <div>
        <button
          onClick={handleMenuClick}
          className="focus:outline-none flex items-center"
        >
          <svg
            className={`h-8 w-8 ${menuOpen ? "" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>
      <div>
        {operatorLogged &&
          operatorLogged?.codeOperatorLogged +
            " - " +
            operatorLogged?.nameOperatorLogged}
      </div>
      <div className="text-end pr-2">
        <div>Usuari: {loginUser?.username}</div>
        <button type="button" onClick={logOut}>
          Sortir
        </button>
      </div>
    </header>
  );
};

export default Header;
