import { BaseModel } from "./BaseModel";

export interface Asset extends BaseModel {
    level : number,
    code : string,
    description : string,
    parentId: string,
    childs : Asset[],
}

export interface CreateAssetRequest    {
  code: string,
  description: string,
  level: number,
  parentId: string,
}

export interface UpdateAssetRequest extends CreateAssetRequest {
}