import { SideNavItem } from "app/types/SideNavItem";
import { SvgGear } from "app/icons/icons";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    key: 1,
    title: 'Màquines',
    path: '/machines',
    permission:2
  },
  {
    key: 2,
    title: 'Seccions',
    path: '/section',
    permission:2
  },
  {
    key: 3,
    title: 'Preventius',
    path: '',
    submenu: true,
    permission: 2,
    submenuItems: [
      {
        key: 31,
        title: 'Configuració',
        path: '/preventive',
        permission: 2
      },{
        key: 32,
        title: 'Punts Inspecció',
        path: '/inspectionPoints',
        permission: 2
      },]
  },
  {
    key: 4,
    title: 'Correctius',
    path: '/corrective',
    permission: 0
  },
  {
    key: 5,
    title: 'Ordres de treball',
    path: '/workOrders',
    permission: 0
  },
  {
    key: 6,
    title: 'Operaris',
    path: '/operators',
    permission: 2
  },
  {
    key: 7,
    title: 'Recanvis',
    path: '/spareParts',
    permission: 0,
    icon : SvgGear,
  },
];
