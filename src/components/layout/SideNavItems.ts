import { SideNavItem, generateKey } from "app/types/SideNavItem";
import { SvgGear, SvgMachine, SvgSparePart } from "app/icons/icons";
import { UserPermission } from "app/interfaces/User";

export const SIDENAV_ITEMS: SideNavItem[] = [


  {
    key: generateKey(),
    title: 'Revisions',
    path: '',
    submenu: true,
    permission: UserPermission.Administrator,
    submenuItems: [
      {
        key: generateKey(),
        title: 'Configuració',
        path: '/preventive',
        permission: UserPermission.Administrator
      },{
        key: generateKey(),
        title: 'Punts Inspecció',
        path: '/inspectionPoints',
        permission: UserPermission.Administrator
      },]
  },
  {
    key: generateKey(),
    title: 'Avaries',
    path: '/corrective',
    permission: UserPermission.Worker
  },
  {
    key: generateKey(),
    title: 'Ordres de treball',
    path: '/workOrders',
    permission: UserPermission.Worker
  },
  {
    key: generateKey(),
    title: 'Recanvis',
    path: '/spareParts',
    permission: UserPermission.Worker,
    //icon : SvgSparePart,
  },
  {
    key: generateKey(),
    title: 'Configuració',
    path: '',
    permission: UserPermission.Administrator,
    submenu: true,
    icon : SvgGear,
    submenuItems: [
      {
        key: generateKey(),
        title: 'Actius i Equips',
        path: '/assets',
        permission: UserPermission.Administrator
      },  
      {
        key: generateKey(),
        title: 'Seccions',
        path: '/section',
        permission: UserPermission.Administrator
      },
      {
      key: generateKey(),
      title: 'Màquines',
      path: '/machines',
      //icon: SvgMachine,
      permission: UserPermission.Administrator
      },
      {
        key: generateKey(),
        title: 'Operaris',
        path: '/operators',
        permission: UserPermission.Administrator
      },
    ]
  },
];
