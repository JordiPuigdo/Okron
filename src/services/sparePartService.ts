import SparePart from "interfaces/SparePart";

class SparePartService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getSpareParts(): Promise<SparePart[]> {
    const response = await fetch(`${this.baseUrl}/SparePart`);
    if (!response.ok) {
      throw new Error('Failed to fetch inspection points');
    }
    return response.json();
  }


}

export default SparePartService;
