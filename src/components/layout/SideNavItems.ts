import { SideNavItem } from "app/types/SideNavItem";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    key: 1,
    title: 'Màquines',
    path: '/machines',
    permission:2
  },
  {
    key: 2,
    title: 'Preventius',
    path: '',
    submenu: true,
    permission: 2,
    submenuItems: [
      {
        key: 21,
        title: 'Configuració',
        path: '/preventive',
        permission: 2
      },]
  },
  {
    key: 3,
    title: 'Correctius',
    path: '/corrective',
    permission: 2
  },
  {
    key: 4,
    title: 'Ordres de treball',
    path: '/workOrders',
    permission: 0
  },
  {
    key: 5,
    title: 'Operaris',
    path: '/operators',
    permission: 2
  },
  {
    key: 6,
    title: 'Recanvis',
    path: '/spareParts',
    permission: 2
  },
  /*{
    title: 'Test Sumbenu',
    path: '/crm/tasks',
    submenu: true,
    submenuItems: [
      {
        title: 'sub1',
        path: '/',
      },
      {
        title: 'sub2',
        path: '/',
      },
    ],
  },*/
];
