import { SideNavItem } from "app/types/SideNavItem";
import { useState } from "react";
import { SIDENAV_ITEMS } from "./SideNavItems";
import Link from "next/link";
import { useSessionStore } from "app/stores/globalStore";
import { SvgSpinner } from "app/icons/icons";

const SideNav = () => {
  const { loginUser } = useSessionStore((state) => state);
  return (
    <div className="flex flex-col space-y-2 md:px-6">
      <Link
        className="font-semibold text-lg text-white p-1 hover:bg-purple-900 rounded-md"
        href={"/menu"}
      >
        Ökron
      </Link>
      <div className="pt-4">
        {SIDENAV_ITEMS.map((item, idx) => {
          return (
            <>
              {item.permission <= loginUser?.permission! && (
                <MenuItem key={idx} item={item} />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    [item.key]: false,
  });
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  return (
    <div>
      {item.submenu ? (
        <>
          <button onClick={toggleSubMenu} className="w-full">
            <div className="flex flex-row space-x-4 items-center">
              <span className="font-semibold text-xl flex text-white p-1 w-full hover:bg-purple-900 rounded-md">
                {item.title}
              </span>
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-4 ml-4 flex flex-col space-y-4 ">
              {item.submenuItems?.map((subItem, idx) => {
                return (
                  <Link key={idx} href={subItem.path}>
                    <span
                      className="text-xl font-semibold text-white flex p-1 hover:bg-purple-900 rounded-md"
                      onClick={() =>
                        setIsLoading((prevLoading) => ({
                          ...prevLoading,
                          [subItem.key]: true,
                        }))
                      }
                    >
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
            className="font-semibold text-xl flex text-white p-1 hover:bg-purple-900 rounded-md items-center"
            onClick={() =>
              setIsLoading((prevLoading) => ({
                ...prevLoading,
                [item.key]: true,
              }))
            }
          >
            {item.title}
            {isLoading[item.key] && (
              <SvgSpinner style={{ marginLeft: "0.5rem" }} />
            )}
          </span>
        </Link>
      )}
    </div>
  );
};

export default SideNav;
