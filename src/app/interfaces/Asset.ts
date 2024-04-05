import { BaseModel } from "./BaseModel";

export interface Asset extends BaseModel {
    level : number,
    name : string,
    parentId: string,
    childs : Asset[],
}

export interface CreateAssetRequest    {
  name: string,
  level: number,
  parentId: string,
}

export interface UpdateAssetRequest extends CreateAssetRequest {
}