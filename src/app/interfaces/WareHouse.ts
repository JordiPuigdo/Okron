import { BaseModel } from './BaseModel';
import SparePart from './SparePart';

export interface WareHouse extends BaseModel {
  code: string;
  description: string;
  stock?: WareHouseStock[];
}

export interface WareHouseStock {
  sparePartId: string;
  quantity: number;
  sparePart: SparePart;
}

export interface WareHouseRequest {
  code: string;
  description: string;
}

export interface UpdateWareHouseRequest extends WareHouseRequest {
  id: string;
}

export interface WareHouseSparePartRequest {
  wareHouseId: string;
  sparePartId: string;
  operatorId: string;
}
