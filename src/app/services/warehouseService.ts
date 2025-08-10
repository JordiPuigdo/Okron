import { WareHouseStockAvailability } from 'app/interfaces/Warehouse';

export interface IWareHouseService {
  stockAvailability(): Promise<WareHouseStockAvailability[]>;
}

export class WareHouseService implements IWareHouseService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!) {
    this.baseUrl = baseUrl;
  }
  async stockAvailability(): Promise<WareHouseStockAvailability[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}warehouse/stockAvailability`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch warehouses: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  }
}
export default WareHouseService;
