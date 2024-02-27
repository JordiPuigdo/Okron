export interface User {
    username : string;
    password : string;
}

export interface LoginUser {
    token : string;
    refreshToken : string;
    refreshTokenExpirationDate : Date;
    agentId : string;
    username : string;
    permission : UserPermission
}

export enum UserPermission
{
   Worker,
   OfficeUser,
   Administrator
}

export interface OperatorLogged {
    idOperatorLogged : string;
    codeOperatorLogged : string;
    nameOperatorLogged: string;
}