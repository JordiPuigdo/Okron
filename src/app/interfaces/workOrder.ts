import { Asset } from './Asset';
import { BaseModel } from './BaseModel';
import InspectionPoint from './inspectionPoint';
import Machine from './machine';
import Operator from './Operator';
import { Preventive } from './Preventive';
import { Downtimes, DowntimesReasons } from './Production/Downtimes';
import SparePart from './SparePart';
import { UserType } from './User';

export interface WorkOrder extends BaseModel {
  id: string;
  code: string;
  description: string;
  startTime: Date;
  endTime: Date;
  stateWorkOrder: StateWorkOrder;
  workOrderType: WorkOrderType;
  machineId?: string;
  machine?: Machine;
  workOrderInspectionPoint?: WorkOrderInspectionPoint[];
  workOrderOperatorTimes?: WorkOrderOperatorTimes[];
  operator?: Operator[];
  operatorId?: string[];
  workOrderSpareParts?: WorkOrderSparePart[];
  workOrderComments?: WorkOrderComment[];
  asset?: Asset;
  workOrderEvents?: WorkOrderEvents[];
  preventive?: Preventive;
  plannedDuration: string;
  operatorsNames?: string;
  originWorkOrder?: OriginWorkOrder;
  downtimeReason?: DowntimesReasons;
  downtimes?: Downtimes;
}

export default WorkOrder;

export interface WorkOrderSparePart {
  creationDate?: Date;
  id: string;
  quantity: number;
  sparePart: SparePart;
}

export enum StateWorkOrder {
  Waiting,
  OnGoing,
  Paused,
  Finished,
  Requested,
  PendingToValidate,
  Open,
}

export enum OriginWorkOrder {
  Maintenance,
  Production,
}

export interface WorkOrderInspectionPoint {
  id: string;
  check?: boolean;
  inspectionPoint: InspectionPoint;
}

export interface WorkOrderOperatorTimes {
  id?: string;
  startTime: Date;
  endTime?: Date;
  totalTime?: string;
  operator: Operator;
}

export interface UpdateWorkOrderRequest extends CreateWorkOrderRequest {
  downtimeReason?: DowntimesReasons;
  startTime?: Date;
}

export interface CreateWorkOrderRequest {
  id?: string;
  code?: string;
  description: string;
  initialDateTime?: Date;
  stateWorkOrder: StateWorkOrder;
  workOrderType?: WorkOrderType;
  machineId?: string;
  assetId?: string;
  operatorId?: string[];
  inspectionPointId?: string[];
  sparePartId?: string[];
  userId?: string;
  operatorCreatorId: string;
  originWorkOrder: UserType;
  downtimeReasonId?: string;
}

export interface AddWorkOrderOperatorTimes {
  WorkOrderId: string;
  startTime: Date;
  operatorId: string;
  workOrderOperatorTimesId?: string;
}

export interface FinishWorkOrderOperatorTimes {
  WorkOrderId: string;
  finishTime: Date;
  operatorId: string;
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
  machineId?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  operatorId?: string;
  assetId?: string;
  stateWorkOrder?: StateWorkOrder;
}

export enum WorkOrderType {
  Corrective = 0,
  Preventive = 1,
  Predicitve = 2,
}

export interface SaveInspectionResultPointRequest {
  WorkOrderId: string;
  WorkOrderInspectionPointId: string;
  resultInspectionPoint: ResultInspectionPoint;
}

export enum ResultInspectionPoint {
  Pending,
  Ok,
  NOk,
}

export interface WorkOrderComment {
  id?: string;
  creationDate: string;
  comment: string;
  operator: Operator;
}

export interface AddCommentToWorkOrderRequest {
  comment: string;
  operatorId: string;
  workOrderId: string;
}

export interface UpdateStateWorkOrder {
  workOrderId: string;
  state: StateWorkOrder;
  operatorId?: string;
  userId?: string;
}

export interface WorkOrderEvents {
  id: string;
  date: string;
  endDate?: string;
  workOrderEventType: WorkOrderEventType;
  operator: Operator;
}

export enum WorkOrderEventType {
  Requested,
  Waiting,
  Started,
  Paused,
  PendingToValidate,
  Finished,
  Created,
}
