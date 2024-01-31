import Operator from "./Operator";
import SparePart from "./SparePart";
import Machine from "./machine";

export interface WorkOrder {
  id: string;
  code : string;
  description: string;
  startTime: Date;
  endTime: Date;
  stateWorkOrder: StateWorkOrder;
  workOrderType : WorkOrderType;
  machineId: string
  machine? : Machine;
  workOrderInspectionPoint?: WorkOrderInspectionPoint[];
  workOrderTimes?: WorkOrderTimes[]
  operator?: Operator[];
  operatorId?: string[];
  workOrderSpareParts?: WorkOrderSparePart[]
}

export default WorkOrder;

export interface WorkOrderSparePart extends SparePart
{
  Quantity : number;
}

export enum StateWorkOrder {
  Waiting = 0,
  OnGoing = 1,
  Paused = 2,
  Finished = 3,
}


interface WorkOrderInspectionPoint {
  inspectionPointId: string;
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

export interface UpdateWorkOrderRequest extends CreateWorkOrderRequest {
  startTime?: Date;
}

export interface CreateWorkOrderRequest {
  id?: string;
  code?: string;
  description: string;
  initialDateTime?: Date;
  stateWorkOrder: StateWorkOrder;
  workOrderType?: WorkOrderType;
  machineId?: string
  operatorId?: string[];
  inspectionPointId?: string[];
  sparePartId?: string[]
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

export interface SearchWorkOrderFilters {
  machineId : string;
  startTime? : string;
  endTime? : string;
}

export enum WorkOrderType {
  Corrective = 0,
  Preventive = 1,
  Predicitve = 2,
}