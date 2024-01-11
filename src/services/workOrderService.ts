import WorkOrder, { AddWorkOrderTimes, FinishWorkOrderTimes, SearchWorkOrderFilters } from 'interfaces/workOrder';

class WorkOrderService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async addWorkOrderTimes(addWorkOrderTimes: AddWorkOrderTimes): Promise<boolean> {
    try {
      const url = `${this.baseUrl}AddWorkOrderTimes`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addWorkOrderTimes),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch addWorkOrderTimes');
      }
      if (response.status === 204) {
        return true;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching addWorkOrderTimes:', error);
      throw error;
    }
  }

  async finishWorkOrderTimes(finishWorkOrderTimes: FinishWorkOrderTimes): Promise<boolean> {
    try {
      const url = `${this.baseUrl}FinishWorkOrderTimes`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finishWorkOrderTimes),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch addWorkOrderTimes');
      }
      if (response.status === 204) {
        return true;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching addWorkOrderTimes:', error);
      throw error;
    }
  }

  async getWorkOrdersByMachine(Id: string): Promise<WorkOrder[]> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder?MachineId=${Id}`
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch WorkOrders-machines');
      }
      if (response.status === 204) {
        return [];
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching WorkOrders by machines:', error);
      throw error;
    }
  }


  async getWorkOrdersById(Id: string): Promise<WorkOrder[]> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder?MachineId=${Id}`
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch WorkOrders-machines');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching WorkOrders by machines:', error);
      throw error;
    }
  }

  async getWorkOrderById(Id: string): Promise<WorkOrder | undefined> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder/${Id}`
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch WorkOrders');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching WorkOrder:', error);
      throw error;
    }
  }

  async updateWorkOrder(updateWorkOrder: WorkOrder): Promise<boolean> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateWorkOrder),
      });

      if (!response.ok) {
        throw new Error('Failed to update WorkOrder');
      }

      if (response.status === 204) {
        return true;
      }

      return response.json();
    } catch (error) {
      console.error('Error updating WorkOrder:', error);
      throw error;
    }
  }


  async getWorkOrdersWithFilters(searchWorkOrderFilters: SearchWorkOrderFilters): Promise<WorkOrder[]> {
    try {
      const url = `${this.baseUrl}/getWorkOrderWithFilters?MachineId=${searchWorkOrderFilters.machineId}` 
        +`&StartDateTime=${searchWorkOrderFilters.startTime}&EndDateTime=${searchWorkOrderFilters.endTime}`  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch WorkOrders-machines');
      }
      if (response.status === 204) {
        return [];
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching WorkOrders by machines:', error);
      throw error;
    }
  }

}

export default WorkOrderService;
