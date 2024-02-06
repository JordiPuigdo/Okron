import { StateWorkOrder, WorkOrderType } from "interfaces/workOrder";

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

export const formatDate = (dateString: any, includeHours: boolean = true) => {
  if (dateString === null) {
    return "";
  }
  const options: any = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: includeHours ? "2-digit" : undefined,
    minute: includeHours ? "2-digit" : undefined,
    second: includeHours ? "2-digit" : undefined,
    hour12: false, // Use 24-hour format
  };
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return null;
  }

  const formattedDate = date.toLocaleDateString("es-ES", options);
  return `${formattedDate.replace(",", "")}`;
};

export const translateWorkOrderType = (type: any): string => {
  switch (type) {
    case WorkOrderType.Corrective:
      return "Correctiu";
    case WorkOrderType.Preventive:
      return "Preventiu";
    case WorkOrderType.Predicitve:
      return "Predictiu";
    default:
      return "Error";
  }
};
