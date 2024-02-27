export type SideNavItem = {
    key : number
    title : string;
    path : string;
    submenu? : boolean;
    submenuItems?: SideNavItem[];
    permission : number;
};