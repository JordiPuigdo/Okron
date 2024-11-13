import { BaseModel } from '../BaseModel';

export interface DowntimesReasons extends BaseModel {
  description: string;
  machineId: string;
  downTimeType: DowntimesReasonsType;
}

export enum DowntimesReasonsType {
  Maintanance,
  Production,
}

export interface DowntimesReasonsRequest {
  description: string;
  machineId: string;
  downTimeType: DowntimesReasonsType;
}

export interface DowntimesReasonsUpdateRequest extends DowntimesReasonsRequest {
  id: string;
}
