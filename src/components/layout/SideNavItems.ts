import { SvgGear } from "app/icons/icons";
import { UserPermission, UserType } from "app/interfaces/User";
import { generateKey,SideNavItem } from "app/types/SideNavItem";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    key: generateKey(),
    title: "Revisions",
    path: "",
    submenu: true,
    permission: [UserPermission.Administrator],
    userType: [UserType.Maintenance],
    submenuItems: [
      {
        key: generateKey(),
        title: "Configuració",
        path: "/preventive",
        permission: [UserPermission.Administrator],
        userType: [UserType.Maintenance],
      },
      {
        key: generateKey(),
        title: "Punts Inspecció",
        path: "/inspectionPoints",
        permission: [UserPermission.Administrator],
        userType: [UserType.Maintenance],
      },
    ],
  },
  {
    key: generateKey(),
    title: "Avaries",
    path: "/corrective",
    permission: [UserPermission.Administrator, UserPermission.Worker],
    userType: [UserType.Maintenance, UserType.Production],
  },
  {
    key: generateKey(),
    title: "Ordres de treball",
    path: "/workOrders",
    permission: [UserPermission.Administrator, UserPermission.Worker],
    userType: [UserType.Maintenance],
  },
  {
    key: generateKey(),
    title: "Recanvis",
    path: "/spareParts",
    permission: [
      UserPermission.Administrator,
      UserPermission.Worker,
      UserPermission.SpareParts,
    ],
    userType: [UserType.Maintenance],
    //icon : SvgSparePart,
  },
  {
    key: generateKey(),
    title: "Reports",
    path: "/reports/spareParts/consumedSpareParts",
    permission: [UserPermission.Administrator, UserPermission.SpareParts],
    userType: [UserType.Maintenance],
    //icon : SvgSparePart,
  },
  {
    key: generateKey(),
    title: "Configuració",
    path: "",
    permission: [UserPermission.Administrator],
    userType: [UserType.Maintenance, UserType.Production],
    submenu: true,
    icon: SvgGear,
    submenuItems: [
      {
        key: generateKey(),
        title: "Actius i Equips",
        path: "/assets",
        permission: [UserPermission.Administrator],
        userType: [UserType.Maintenance],
      },
      {
        key: generateKey(),
        title: "Seccions",
        path: "/section",
        userType: [UserType.Production],
        permission: [UserPermission.Administrator],
      },
      {
        key: generateKey(),
        title: "Màquines",
        path: "/machines",
        userType: [UserType.Production],
        permission: [UserPermission.Administrator],
      },
      {
        key: generateKey(),
        title: "Operaris",
        path: "/operators",
        userType: [UserType.Production, UserType.Maintenance],
        permission: [UserPermission.Administrator],
      },
      {
        key: generateKey(),
        title: "Usuaris",
        path: "/users",
        userType: [UserType.Production, UserType.Maintenance],
        permission: [UserPermission.Administrator],
      },
    ],
  },
];
