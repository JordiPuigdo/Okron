import { StateWorkOrder } from "interfaces/workOrder";

export const translateStateWorkOrder = (state: any): string => {
  switch (state) {
    case StateWorkOrder.Waiting:
      return "Pendent";
    case StateWorkOrder.OnGoing:
      return "En curs";
    case StateWorkOrder.Paused:
      return "En pausa";
    case StateWorkOrder.Finished:
      return "Finalitzada";
    default:
      return "";
  }
};
