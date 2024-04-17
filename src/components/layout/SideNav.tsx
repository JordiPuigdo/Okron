import { SideNavItem } from "app/types/SideNavItem";
import { useState } from "react";
import { SIDENAV_ITEMS } from "./SideNavItems";
import Link from "next/link";
import { useSessionStore } from "app/stores/globalStore";
import { SvgSpinner } from "app/icons/icons";

const SideNav = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useSessionStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");

  const sideBarItems = SIDENAV_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submenuItems?.some((subItem) =>
        subItem.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col md:px-4">
      <Link
        className="flex items-center font-semibold text-lg text-white p-1 hover:bg-purple-900 rounded-md"
        href={"/menu"}
        onClick={() => setIsLoading(true)}
      >
        Okron
        {isLoading && (
          <span className="ml-2 text-xs text-white">
            <SvgSpinner className="w-6 h-6" />
          </span>
        )}
      </Link>
      <div className="pt-4 ">
        <input
          type="text"
          className="md:px-4 w-full my-4 p-2 border border-gray-300 rounded-md"
          placeholder="Buscar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {sideBarItems.map((item, idx) => {
          return (
            <>
              {item.permission <= loginUser?.permission! && (
                <>
                  <MenuItem
                    key={idx}
                    item={item}
                    isOpenSubMenu={
                      sideBarItems.length != SIDENAV_ITEMS.length ? true : false
                    }
                    onClick={() => setSearchTerm("")}
                  />
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
  isOpenSubMenu = false,
  onClick,
}: {
  item: SideNavItem;
  isOpenSubMenu: boolean;
  onClick?: () => void;
}) => {
  const [subMenuOpen, setSubMenuOpen] = useState(isOpenSubMenu);
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
                <span className="font-semibold text-l flex text-white p-1 w-full hover:bg-purple-900 rounded-md items-center">
                  {item.icon && <item.icon className="mr-2 " />}
                  {item.title}
                </span>
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
                        } font-semibold text-white flex p-1 hover:bg-purple-900 rounded-md items-center`}
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
              className="font-semibold text-l flex text-white p-1 hover:bg-purple-900 rounded-md items-center"
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
