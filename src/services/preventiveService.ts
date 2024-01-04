import { CreatePreventiveRequest, Preventive, UpdatePreventiveRequest } from "interfaces/Preventive";

class PreventiveService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getPreventives(): Promise<Preventive[]> {
    const response = await fetch(`${this.baseUrl}/preventive`);
    if (!response.ok) {
      throw new Error('Failed to fetch inspection points');
    }
    return response.json();
  }

    async createPreventive(createPreventiveRequest: CreatePreventiveRequest | null): Promise<boolean> {
    try {
      console.log(createPreventiveRequest);
      const url = `${this.baseUrl}/preventive`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPreventiveRequest),
      });
      if (!response.ok) {
        throw new Error(`Failed to create operator`);
      }
      return true;
    } catch (error) {
      console.error('Error creating operators:', error);
      throw error;
    }
  }

  async getPreventive(id: string | null): Promise<Preventive> {
    try {
      const url = `${this.baseUrl}/preventive/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get preventive`);
      }

      const responseBody = await response.json(); 
      return responseBody as Preventive;
    } catch (error) {
      console.error('Error getting preventive:', error);
      throw error;
    }
  }

  async updatePreventive(updatePreventiveRequest : UpdatePreventiveRequest ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/preventive`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePreventiveRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to get preventive`);
      }
      return true;
    } catch (error) {
      console.error('Error getting preventive:', error);
      throw error;
    }
  }


  async deletePreventive(id : string ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/preventive/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get preventive`);
      }

      return true;
    } catch (error) {
      console.error('Error getting preventive:', error);
      throw error;
    }
  }


  async CreateWorkOrderPreventivePerDay(): Promise<Preventive[] | null> {
    const response = await fetch(`${this.baseUrl}/preventive/CreateWorkOrderPreventivePerDay`);
    if (!response.ok) {
      throw new Error('Failed to fetch inspection points');
    }
    const responseBody = await response.json(); 
    return responseBody as Preventive[];
  }

}

export default PreventiveService;