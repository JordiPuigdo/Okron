import { BaseModel } from '../BaseModel';
import Operator from '../Operator';

export interface Downtimes extends BaseModel {
  startTime: string;
  endTime: string;
  totalTime: string;
  operator: Operator;
  originDowntime: OriginDowntime;
}

export enum OriginDowntime {
  Maintenance,
  Production,
}

export interface DowntimesReasons extends BaseModel {
  description: string;
  machineId: string;
  assetId: string;
  downTimeType: DowntimesReasonsType;
}

export enum DowntimesReasonsType {
  Maintanance,
  Production,
}

export interface DowntimesReasonsRequest {
  description: string;
  machineId?: string;
  assetId?: string;
  downTimeType: DowntimesReasonsType;
}

export interface DowntimesReasonsUpdateRequest extends DowntimesReasonsRequest {
  id: string;
}
