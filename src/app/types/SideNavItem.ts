import { UserPermission } from "app/interfaces/User";
import { SVGProps } from "react";

export type SideNavItem = {
    key : number
    title : string;
    path : string;
    submenu? : boolean;
    submenuItems?: SideNavItem[];
    permission : UserPermission;
    icon?: React.FunctionComponent<SVGProps<SVGSVGElement>>;
};

