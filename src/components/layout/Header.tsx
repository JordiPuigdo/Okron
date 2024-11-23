import { useState } from 'react';
import { useSessionStore } from 'app/stores/globalStore';
import useRoutes from 'app/utils/useRoutes';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { SvgAccount, SvgLogo, SvgLogOut, SvgMenu } from 'app/icons/icons';
import SignOperator from 'components/operator/SignOperator';
import { UserPermission, UserType } from 'app/interfaces/User';
import FinalizeWorkOrdersDaysBefore from 'app/(pages)/workOrders/components/FinalizeWorkOrdersDaysBefore';
import GeneratePreventive from 'app/(pages)/preventive/components/GeneratePreventive';

type Header = {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<Header> = ({ setOpenMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loginUser, operatorLogged, setLoginUser, setOperatorLogged } =
    useSessionStore(state => state);
  const router = useRouter();
  const ROUTES = useRoutes();
  const pathname = usePathname();

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
    <header className="flex items-center justify-between bg-white text-lg font-semibold text-white p-4 w-full sticky transition-all shadow-md">
      <div className="flex items-center gap-3 pl-1">
        <button onClick={handleMenuClick}>
          <SvgMenu width={30} height={30} className="text-okron-main" />
        </button>
        <Link
          className="hidden md:flex sm:flex items-center font-semibold text-lg text-gray-900 p-1 bg-white rounded-md"
          href={'/menu'}
        >
          <SvgLogo />
        </Link>
        <div className="flex items-center ml-6">
          <SignOperator />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-black">
          {operatorLogged &&
            operatorLogged?.codeOperatorLogged +
              ' - ' +
              operatorLogged?.nameOperatorLogged}
        </div>
        <div>
          {loginUser?.permission == UserPermission.Administrator &&
            pathname === '/menu' &&
            loginUser!.userType == UserType.Maintenance && (
              <div className="flex flex-row gap-2 bg-white rounded-xl">
                <FinalizeWorkOrdersDaysBefore />
                <GeneratePreventive />
              </div>
            )}
        </div>
        <div className="flex items-center justify-end pr-2 text-gray-700 gap-1">
          <SvgAccount />
          {loginUser?.username &&
            loginUser?.username.charAt(0)?.toUpperCase() +
              loginUser?.username?.slice(1)}

          <button
            type="button"
            className="hover:text-purple-900 ml-6"
            onClick={logOut}
          >
            <SvgLogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
