import SparePart from "./SparePart";

export interface WorkOrder {
  id: string;
  description: string;
  initialDateTime: Date;
  finalDateTime: Date;
  stateWorkOrder: stateWorkOrder;
  machineId: string
  WorkOrderInspectionPoint: WorkOrderInspectionPoint[];
  WorkOrderTimes: WorkOrderTimes[]
  operatorId: string[];
  spareParts: SparePart[]
}

export enum stateWorkOrder {
  Waiting = 0,
  OnGoing = 1,
  Paused = 2,
  Finished = 3,
}
export default WorkOrder;

interface WorkOrderInspectionPoint {
  id: string;
  description: string;
  check: boolean;
}

interface WorkOrderTimes {
  id: string;
  startTime: Date;
  endTime: Date;
  totalTime: string;
  operatorId: string;
  name: string;
}


export interface CreateWorkOrderRequest {
  id: string;
  description: string;
  initialDateTime: Date;
  stateWorkOrder: stateWorkOrder;
  machineId: string
  operatorId: string[];
  inspectionPointId: string[];
  sparePartId: string[]
}

export interface AddWorkOrderTimes {
  WorkOrderId: string;
  startTime: Date;
  operatorId: string
}

export interface FinishWorkOrderTimes {
  WorkOrderId: string;
  finishTime: Date;
  operatorId: string
}