import { UserPermission } from "app/interfaces/User";
import { SVGProps } from "react";

export type SideNavItem = {
  key: number;
  title: string;
  path: string;
  submenu?: boolean;
  submenuItems?: SideNavItem[];
  permission: UserPermission[];
  icon?: React.FunctionComponent<SVGProps<SVGSVGElement>>;
};

let keyCounter = 1; // Initialize a counter for generating unique keys

export const generateKey = (): number => {
  return keyCounter++;
};
