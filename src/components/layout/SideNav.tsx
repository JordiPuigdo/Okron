import { SideNavItem } from "app/types/SideNavItem";
import { useState } from "react";
import { SIDENAV_ITEMS } from "./SideNavItems";
import Link from "next/link";
import { useSessionStore } from "app/stores/globalStore";
import { SvgArrowDown, SvgArrowRight, SvgSpinner } from "app/icons/icons";

type SideNavProps = {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

const SideNav: React.FC<SideNavProps> = ({ setOpenMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useSessionStore((state) => state);

  const handleMenuClick = () => {
    setOpenMenu(!menuOpen);
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col md:px-4">
      <div className="pt-14 ">
        {SIDENAV_ITEMS.map((item, idx) => {
          return (
            <>
              {item.permission <= loginUser?.permission! && (
                <>
                  <MenuItem key={idx} item={item} />
                </>
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
  onClick,
}: {
  item: SideNavItem;
  onClick?: () => void;
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
        {item.submenu ? (
          <>
            <button onClick={toggleSubMenu} className="w-full">
              <div className="flex flex-row items-center">
                <span className="font-semibold text-l flex text-gray-700 p-1 w-full hover:text-purple-900 rounded-md items-center">
                  {item.icon && <item.icon className="mr-2 " />}
                  {item.title}
                </span>
                {subMenuOpen ? <SvgArrowDown /> : <SvgArrowRight />}
              </div>
            </button>

            {subMenuOpen && (
              <div className="my-2 ml-2 flex flex-col ">
                {item.submenuItems?.map((subItem, idx) => {
                  return (
                    <Link key={idx} href={subItem.path}>
                      <span
                        className={`${
                          isLoading[subItem.key] ? "text-sm" : "text-sm"
                        } font-semibold text-gray-700 flex p-1 hover:text-purple-900 rounded-md items-center`}
                        onClick={() => {
                          onClick && onClick();
                          setIsLoading((prevLoading) => ({
                            ...prevLoading,
                            [subItem.key]: true,
                          }));
                        }}
                      >
                        {subItem.icon && <subItem.icon className="mr-2 " />}
                        {subItem.title}
                        {isLoading[subItem.key] && (
                          <SvgSpinner style={{ marginLeft: "0.5rem" }} />
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
              className="font-semibold text-l flex text-gray-700 p-1 w-full hover:text-purple-900 rounded-md items-center"
              onClick={() => {
                onClick && onClick();
                setIsLoading((prevLoading) => ({
                  ...prevLoading,
                  [item.key]: true,
                }));
              }}
            >
              {item.icon && <item.icon className="mr-2" />}
              {item.title}
              {isLoading[item.key] && (
                <SvgSpinner style={{ marginLeft: "0.5rem" }} />
              )}
            </span>
          </Link>
        )}
      </div>
    </>
  );
};

export default SideNav;
