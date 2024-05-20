import { OperatorType } from "./Operator";

export interface User {
    username : string;
    password : string;
}

export interface LoginUser {
    token : string;
    refreshToken : string;
    refreshTokenExpiryTime : Date;
    agentId : string;
    username : string;
    permission : UserPermission
}

export enum UserPermission
{
   Worker,
   OfficeUser,
   Administrator,
   SuperAdministrator
}

export interface OperatorLogged {
    idOperatorLogged : string;
    codeOperatorLogged : string;
    nameOperatorLogged: string;
    operatorLoggedType : OperatorType;
}