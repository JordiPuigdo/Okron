import SparePart, { ConsumeSparePart, CreateSparePartRequest, RestoreSparePart, SparePartDetailRequest, SparePartDetailResponse, SparePartPerMachineResponse } from "app/interfaces/SparePart";

class SparePartService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getSpareParts(): Promise<SparePart[]> {
    const response = await fetch(`${this.baseUrl}SparePart`);
    if (!response.ok) {
      throw new Error('Failed to fetch inspection points');
    }
    return response.json();
  }
  async createSparePart(sparePart : CreateSparePartRequest ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}sparePart`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sparePart),
      });

      if (!response.ok) {
        throw new Error(`Failed to update sparePart`);
      }
      return true;
    } catch (error) {
      console.error('Error updating SparePart:', error);
      throw error;
    }
  }
  async updateSparePart(sparePart : SparePart ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}sparePart`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sparePart),
      });

      if (!response.ok) {
        throw new Error(`Failed to update sparePart`);
      }
      return true;
    } catch (error) {
      console.error('Error updating SparePart:', error);
      throw error;
    }
  }

  async getSparePart(sparePartDetailRequest: SparePartDetailRequest): Promise<SparePartDetailResponse> {
      const url = `${this.baseUrl}sparePart/Detail`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sparePartDetailRequest),
      });
    if (!response.ok) {
      throw new Error('Failed to fetch spare part');
    }

    const sparePart: SparePartDetailResponse = await response.json();
    return sparePart;
  }

  async getSparePartHistoryByDates(sparePartDetailRequest : SparePartDetailRequest  ): Promise<SparePartPerMachineResponse[]> {
    const url =(`${this.baseUrl}sparepart/ConsumesPerMachine`);
     const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sparePartDetailRequest),
      });

    if (!response.ok) {
      throw new Error('Failed to fetch spare part');
    }

    const sparePart: SparePartPerMachineResponse[]= await response.json();
    return sparePart;
  }

  async consumeSparePart(consumeSparePartRequest : ConsumeSparePart ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}sparePart/consume`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consumeSparePartRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to update sparePart`);
      }
      return true;
    } catch (error) {
      console.error('Error updating SparePart:', error);
      throw error;
    }
  }

  async restoreSparePart(restoreSparePart : RestoreSparePart ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}sparePart/restore`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restoreSparePart),
      });

      if (!response.ok) {
        throw new Error(`Failed to update sparePart`);
      }
      return true;
    } catch (error) {
      console.error('Error updating SparePart:', error);
      throw error;
    }
  }

  async deleteSparePart(id: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}sparePart/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update sparePart`);
      }
      return true;
    } catch (error) {
      console.error('Error updating SparePart:', error);
      throw error;
    }
    
  }

}

export default SparePartService;
