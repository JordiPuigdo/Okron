import { BaseModel } from './BaseModel';
import SparePart from './SparePart';

export interface WareHouseStock {
  sparePartId: string;
  providerId: string;
  quantity: number;
  price: string;
  sparePart: SparePart;
  lastUpdate: string;
  isBelowMinimum: boolean;
  serialStocks: SerialStocks[];
}

export interface WareHouseStockAvailability {
  sparePartId: string;
  sparePartCode: string;
  sparePartName: string;
  warehouseStock: StockAvailability[];
}

export interface StockAvailability {
  warehouseId: string;
  warehouse: string;
  stock: number;
  serialStocks: SerialStocks[];
}

export interface SerialStocks extends BaseModel {
  serialNumber: string;
  quantity: number;
}

export interface WareHouse {
  id: string;
  description: string;
  active: boolean;
}
