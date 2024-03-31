import WorkOrder, { AddCommentToWorkOrderRequest, AddWorkOrderOperatorTimes, CreateWorkOrderRequest, FinishWorkOrderOperatorTimes, SaveInspectionResultPointRequest, SearchWorkOrderFilters, StateWorkOrder, WorkOrderComment, WorkOrderType } from 'app/interfaces/workOrder';

class WorkOrderService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async addWorkOrderOperatorTimes(AddWorkOrderOperatorTimesValues: AddWorkOrderOperatorTimes): Promise<boolean> {
    try {
      const url = `${this.baseUrl}AddWorkOrderOperatorTimes`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(AddWorkOrderOperatorTimesValues),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch AddWorkOrderOperatorTimes');
      }
      if (response.status === 204) {
        return true;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching AddWorkOrderOperatorTimes:', error);
      throw error;
    }
  }

  async finishWorkOrderOperatorTimes(FinishWorkOrderOperatorTimes: FinishWorkOrderOperatorTimes): Promise<boolean> {
    try {
      const url = `${this.baseUrl}FinishWorkOrderOperatorTimes`
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FinishWorkOrderOperatorTimes),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch AddWorkOrderOperatorTimes');
      }
      if (response.status === 204) {
        return true;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching AddWorkOrderOperatorTimes:', error);
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

  async updateWorkOrder(updateWorkOrder: CreateWorkOrderRequest): Promise<boolean> {
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
      let url = `${this.baseUrl}GetWorkOrderWithFilters?`;
      searchWorkOrderFilters.machineId ? url += `machineId=${searchWorkOrderFilters.machineId}`: "";
      searchWorkOrderFilters.startTime ? url +=      `&startDateTime=${searchWorkOrderFilters.startTime || ''}` +
      `&endDateTime=${searchWorkOrderFilters.endTime || ''}` : "";
      searchWorkOrderFilters.operatorId? url += `&operatorId=${searchWorkOrderFilters.operatorId || ''}`: "";

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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

  async deleteWorkOrder(id : string ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete work order`);
      }

      return true;
    } catch (error) {
      console.error('Error delete work order:', error);
      throw error;
    }
  }


  async countByWorkOrderType(workOrderType : WorkOrderType ): Promise<number> {
    try {
      const url = `${this.baseUrl}CountByWorkOrderType?workOrderTypeDto=${workOrderType}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to CountByWorkOrderType`);
      }

      return parseInt(await response.text(), 10);
    } catch (error) {
      console.error('Error CountByWorkOrderType:', error);
      throw error;
    }
  }

  async saveInspectionPointResult(saveInspectionPointResul: SaveInspectionResultPointRequest): Promise<WorkOrder[]> {
    try {
      const url = `${this.baseUrl}SaveInsepctionPointResult`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify(saveInspectionPointResul),
      });
      
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

  
  async updateStateWorkOrder(id : string, workOrderState : StateWorkOrder): Promise<boolean> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder/${id}?state=${workOrderState}`;

      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update WorkOrder');
      }
      return true;
    } catch (error) {
      console.error('Error updating WorkOrder:', error);
      throw error;
    }
  }

  async addCommentToWorkOrder(addCommentToWorkOrder: AddCommentToWorkOrderRequest): Promise<WorkOrderComment> {
    try {
      const url = `${this.baseUrl}AddCommentToWorkOrder`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addCommentToWorkOrder),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch addCommentToWorkOrder');
      }
      if (response.status === 204) {
        return {} as WorkOrderComment;
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching addCommentToWorkOrder:', error);
      throw error;
    }
  }

  async deleteCommentToWorkOrder(workOrderId : string, commentId : string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}CommentToWorkOrder?workOrderId=${workOrderId}&commentId=${commentId}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch addCommentToWorkOrder');
      }
      if (response.status === 204) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error fetching addCommentToWorkOrder:', error);
      throw error;
    }
  }

  async finishWorkOrdersByDate(date: Date): Promise<boolean> {
    try {
      const isoDateString = date.toISOString();
      const url = `${this.baseUrl}FinishWorkOrdersByDate`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isoDateString),
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

  async cleanCache(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}machine-WorkOrder/CleanCache`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch WorkOrders-machines');
      }
      if (response.status === 204) {
        return false;
      }
      return true;

    } catch (error) {
      console.error('Error updating WorkOrder:', error);
      throw error;
    }
  }
}




export default WorkOrderService;
