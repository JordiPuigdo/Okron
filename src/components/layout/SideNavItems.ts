import { SideNavItem } from "app/types/SideNavItem";
import { SvgGear } from "app/icons/icons";
import { UserPermission } from "app/interfaces/User";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    key: 1,
    title: 'Màquines',
    path: '/machines',
    permission: UserPermission.Administrator
  },
  {
    key: 2,
    title: 'Seccions',
    path: '/section',
    permission: UserPermission.Administrator
  },
  {
    key: 3,
    title: 'Preventius',
    path: '',
    submenu: true,
    permission: UserPermission.Administrator,
    submenuItems: [
      {
        key: 31,
        title: 'Configuració',
        path: '/preventive',
        permission: UserPermission.Administrator
      },{
        key: 32,
        title: 'Punts Inspecció',
        path: '/inspectionPoints',
        permission: UserPermission.Administrator
      },]
  },
  {
    key: 4,
    title: 'Correctius',
    path: '/corrective',
    permission: UserPermission.Worker
  },
  {
    key: 5,
    title: 'Ordres de treball',
    path: '/workOrders',
    permission: UserPermission.Worker
  },
  {
    key: 6,
    title: 'Operaris',
    path: '/operators',
    permission: UserPermission.Administrator
  },
  {
    key: 7,
    title: 'Recanvis',
    path: '/spareParts',
    permission: UserPermission.Worker
    //icon : SvgGear,
  },
  {
    key: 9,
    title: 'Sistema',
    path: '/spareParts',
    permission: UserPermission.Administrator,
    icon : SvgGear,
  },
];
