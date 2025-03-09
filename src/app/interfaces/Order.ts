import { BaseModel } from './BaseModel';
import SparePart from './SparePart';

export interface Order extends BaseModel {
  code: string;
  providerId: string;
  items: OrderItem[];
  status: OrderStatus;
  type: OrderType;
  comment: string;
  date: string;
  relationOrderId?: string;
  orderEvents: OrderEvents[];
}

export enum OrderStatus {
  Pending,
  InProgress,
  Completed,
  Cancelled,
  Purchase,
}

export enum OrderType {
  Purchase,
  Delivery,
  Return,
}

export interface OrderItem extends BaseModel {
  sparePartId: string;
  quantity: number;
  unitPrice: number;
  sparePart: SparePart;
}

export interface OrderEvents extends BaseModel {
  comment: string;
  status: OrderStatus;
}

export interface OrderCreationRequest {
  code: string;
  providerId: string;
  items: OrderItemRequest[];
  status: OrderStatus;
  type: OrderType;
  comment: string;
  date: string;
}

export interface OrderItemRequest {
  sparePartId: string;
  sparePart: SparePart;
  quantity: number;
  unitPrice: number;
  wareHouseId?: string;
  providerId?: string;
}

export interface OrderUpdateRequest extends OrderCreationRequest {
  id: string;
}
