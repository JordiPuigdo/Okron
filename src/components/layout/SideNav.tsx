import { useState } from 'react';
import { SvgArrowDown, SvgArrowRight, SvgSpinner } from 'app/icons/icons';
import { UserType } from 'app/interfaces/User';
import { useSessionStore } from 'app/stores/globalStore';
import { SideNavItem } from 'app/types/SideNavItem';
import Link from 'next/link';

import { SIDENAV_ITEMS } from './SideNavItems';

type SideNavProps = {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
};

const SideNav: React.FC<SideNavProps> = ({ menuOpen }) => {
  const { loginUser } = useSessionStore(state => state);
  const loginPermission = loginUser?.permission!;
  const loginUserType = loginUser?.userType!;

  return (
    <div className="flex flex-col md:px-4">
      <div className="pt-14">
        {SIDENAV_ITEMS.map((item, idx) => {
          return (
            <>
              {item.permission.includes(loginPermission) &&
                item.userType !== undefined &&
                item.userType.includes(loginUserType) && (
                  <MenuItem
                    key={idx}
                    item={item}
                    userType={loginUserType}
                    menuOpen={menuOpen}
                  />
                )}
            </>
          );
        })}
      </div>
    </div>
  );
};

const MenuItem = ({
  item,
  userType,
  menuOpen,
}: {
  item: SideNavItem;
  userType: UserType;
  menuOpen: boolean;
}) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    [item.key]: false,
  });

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <>
      <div>
        {item.submenu &&
        userType !== undefined &&
        item.userType?.includes(userType) ? (
          <>
            <button
              onClick={toggleSubMenu}
              className="w-full hover:text-okron-main"
            >
              <div className="flex flex-row items-center hover:text-okron-main">
                <span className="font-sm text-l flex text-gray-700 p-1 w-full hover:text-okron-main mb-1 rounded-md items-center">
                  {item.icon && (
                    <item.icon
                      className={` ${
                        menuOpen
                          ? 'min-w-[16px] min-h-[16px] mr-4'
                          : 'min-w-[24px] min-h-[24px] mb-1'
                      } hover:text-okron-main`}
                    />
                  )}

                  {menuOpen && item.title}
                </span>
                {subMenuOpen ? <SvgArrowDown /> : <SvgArrowRight />}
              </div>
            </button>

            {subMenuOpen && (
              <div className="ml-2 flex flex-col">
                {item.submenuItems
                  ?.filter(x => x.userType?.includes(userType))
                  .map((subItem, idx) => {
                    return (
                      <Link key={idx} href={subItem.path}>
                        <span
                          className="text-sm font-small text-gray-700 flex hover:text-okron-main rounded-md mb-2 items-center"
                          onClick={() => {
                            setIsLoading(prevLoading => ({
                              ...prevLoading,
                              [subItem.key]: true,
                            }));
                          }}
                        >
                          {subItem.icon && (
                            <subItem.icon
                              className={`${
                                menuOpen
                                  ? 'min-w-[16px] min-h-[16px] mr-2'
                                  : 'min-w-[14px] min-h-[14px]'
                              } hover:text-okron-main`}
                            />
                          )}

                          {menuOpen && subItem.title}
                          {isLoading[subItem.key] && (
                            <SvgSpinner style={{ marginLeft: '0.5rem' }} />
                          )}
                        </span>
                      </Link>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <Link href={item.path}>
            <span
              className="font-sm text-l flex text-gray-700 flex gap-2 p-1 w-full hover:text-okron-main rounded-md items-center"
              onClick={() => {
                setIsLoading(prevLoading => ({
                  ...prevLoading,
                  [item.key]: true,
                }));
              }}
            >
              {item.icon && (
                <item.icon
                  className={`${
                    menuOpen
                      ? 'min-w-[16px] min-h-[16px] mr-2'
                      : 'min-w-[24px] min-h-[24px] mb-2'
                  } hover:text-okron-main`}
                />
              )}
              {menuOpen && item.title}
            </span>
          </Link>
        )}
      </div>
    </>
  );
};

export default SideNav;
