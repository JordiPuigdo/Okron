import SparePart from "interfaces/SparePart";

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

  async getSparePart(id: string): Promise<SparePart> {
    const response = await fetch(`${this.baseUrl}sparepart/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch spare part');
    }

    const sparePart: SparePart = await response.json();
    return sparePart;
  }



}

export default SparePartService;
