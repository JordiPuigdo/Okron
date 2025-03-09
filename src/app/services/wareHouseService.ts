import {
  UpdateWareHouseRequest,
  WareHouse,
  WareHouseRequest,
  WareHouseSparePartRequest,
} from 'app/interfaces/WareHouse';

export interface IWareHouseService {
  getWareHouses(): Promise<WareHouse[]>;
  createWareHouse(wareHouse: WareHouseRequest): Promise<WareHouse>;
  getWareHouse(id: string): Promise<WareHouse>;
  addSparePart(
    wareHouseSparePartRequest: WareHouseSparePartRequest
  ): Promise<boolean>;
  removeSparePart(
    wareHouseSparePartRequest: WareHouseSparePartRequest
  ): Promise<boolean>;
  updateWareHouse(wareHouse: UpdateWareHouseRequest): Promise<WareHouse>;
}

export class WareHouseService implements IWareHouseService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!) {
    this.baseUrl = baseUrl;
  }
  async addSparePart(
    wareHouseSparePartRequest: WareHouseSparePartRequest
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}warehouse/addSparePart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wareHouseSparePartRequest),
      });
      if (!response.ok) {
        throw new Error(`Failed to create warehouse: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }
  async removeSparePart(
    wareHouseSparePartRequest: WareHouseSparePartRequest
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}warehouse/removeSparePart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wareHouseSparePartRequest),
      });
      if (!response.ok) {
        throw new Error(`Failed to create warehouse: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }
  async updateWareHouse(wareHouse: UpdateWareHouseRequest): Promise<WareHouse> {
    try {
      const response = await fetch(`${this.baseUrl}warehouse`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wareHouse),
      });
      if (!response.ok) {
        throw new Error(`Failed to create warehouse: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }
  async getWareHouse(id: string): Promise<WareHouse> {
    try {
      const response = await fetch(`${this.baseUrl}warehouse/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch warehouse: ${response.statusText}`);
      }
      const wareHouse = await response.json();
      return wareHouse;
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      throw error;
    }
  }

  async getWareHouses(): Promise<WareHouse[]> {
    try {
      const response = await fetch(`${this.baseUrl}warehouse`);
      if (!response.ok) {
        throw new Error(`Failed to fetch warehouses: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      throw error;
    }
  }

  async createWareHouse(wareHouse: WareHouseRequest): Promise<WareHouse> {
    try {
      const response = await fetch(`${this.baseUrl}warehouse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wareHouse),
      });
      if (!response.ok) {
        throw new Error(`Failed to create warehouse: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  }
}
export default WareHouseService;
