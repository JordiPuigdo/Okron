import { extend } from "dayjs";
import { Asset } from "./Asset";
import Operator from "./Operator";
import SparePart from "./SparePart";
import InspectionPoint from "./inspectionPoint";
import Machine from "./machine";
import { BaseModel } from "./BaseModel";

export interface WorkOrder extends BaseModel {
  id: string;
  code : string;
  description: string;
  startTime: Date;
  endTime: Date;
  stateWorkOrder: StateWorkOrder;
  workOrderType : WorkOrderType;
  machineId?: string
  machine? : Machine;
  workOrderInspectionPoint?: WorkOrderInspectionPoint[];
  workOrderOperatorTimes?: WorkOrderOperatorTimes[]
  operator?: Operator[];
  operatorId?: string[];
  workOrderSpareParts?: WorkOrderSparePart[]
  workOrderComments? : WorkOrderComment[]
  asset? : Asset;
}

export default WorkOrder;

export interface WorkOrderSparePart
{
  id : string;
  quantity : number;
  sparePart : SparePart;
}

export enum StateWorkOrder {
  Waiting = 0,
  OnGoing = 1,
  Paused = 2,
  Finished = 3,
}


export interface WorkOrderInspectionPoint {
  id : string;
  check?: boolean;
  inspectionPoint : InspectionPoint;
}

export interface WorkOrderOperatorTimes {
  id?: string;
  startTime: Date;
  endTime?: Date;
  totalTime?: string;
  operator: Operator;
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
  assetId?: string
  operatorId?: string[];
  inspectionPointId?: string[];
  sparePartId?: string[]
}

export interface AddWorkOrderOperatorTimes {
  WorkOrderId: string;
  startTime: Date;
  operatorId: string
  workOrderOperatorTimesId? : string;
}

export interface FinishWorkOrderOperatorTimes {
  WorkOrderId: string;
  finishTime: Date;
  operatorId: string
}

export interface UpdateWorkOrderOperatorTimes {
  workOrderId: string;
  startTime: Date;
  endTime?: Date;
  workOrderOperatorTimesId: string;
}

export interface DeleteWorkOrderOperatorTimes {
  workOrderId: string;
  workOrderOperatorTimesId: string;
}

export interface SearchWorkOrderFilters {
  machineId? : string;
  startDateTime? : string;
  endDateTime? : string;
  operatorId? : string;
  assetId? : string;
}

export enum WorkOrderType {
  Corrective = 0,
  Preventive = 1,
  Predicitve = 2,
}

export interface SaveInspectionResultPointRequest {
  WorkOrderId : string;
  WorkOrderInspectionPointId : string
  resultInspectionPoint : ResultInspectionPoint

}

export enum ResultInspectionPoint {
  Pending,
  Ok,
  NOk
}

export interface WorkOrderComment {
  id?: string;
  creationDate : string;
  comment : string;
  operator : Operator;
}

export interface AddCommentToWorkOrderRequest {
  comment : string;
  operatorId : string;
  workOrderId : string;
}	 