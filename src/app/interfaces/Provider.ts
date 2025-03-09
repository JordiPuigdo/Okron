import { BaseModel } from './BaseModel';
import SparePart from './SparePart';

export interface Provider extends BaseModel {
  name: string;
  nie: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
  providerSpareParts?: ProviderSpareParts[];
}

export interface ProviderSpareParts {
  sparePartId: string;
  providerId: string;
  price: string;
  sparePart?: SparePart;
  provider?: Provider;
}

export interface ProviderRequest {
  name: string;
  nie: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
}

export interface UpdateProviderRequest extends ProviderRequest {
  id: string;
}

export interface AddSparePartProvider {
  sparePartId: string;
  price: number;
}

export interface SparePartProviderRequest {
  providerId: string;
  price: string;
}
