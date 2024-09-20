import { WorkOrderType } from "app/interfaces/workOrder";

export interface FilterWorkOrders {
  startDateTime: Date;
  endDateTime: Date;
  workOrderType?: WorkOrderType;
  assetId?: string;
  code?: string;
}
