import { OperatorType } from "app/interfaces/Operator";
import {
  StateWorkOrder,
  WorkOrderEventType,
  WorkOrderType,
} from "app/interfaces/workOrder";
import { useSessionStore } from "app/stores/globalStore";

export const translateStateWorkOrder = (state: any): string => {
  switch (state) {
    case StateWorkOrder.Waiting:
      return "Pendent";
    case StateWorkOrder.OnGoing:
      return "En curs";
    case StateWorkOrder.Paused:
      return "Pausada";
    case StateWorkOrder.Finished:
      return "Finalitzada";
    case StateWorkOrder.PendingToValidate:
      return "Pendent Validar";
    case StateWorkOrder.Requested:
      return "Sol·licitat";
    default:
      return "";
  }
};

export const translateWorkOrderEventType = (
  eventType: WorkOrderEventType
): string => {
  switch (eventType) {
    /*case WorkOrderEventType.Requested:
      return "Sol·licitud";*/
    case WorkOrderEventType.Waiting:
      return "Pendent";
    case WorkOrderEventType.Started:
      return "En curs";
    case WorkOrderEventType.Paused:
      return "Pausada";
    case WorkOrderEventType.PendingToValidate:
      return "Validació Pendent";
    case WorkOrderEventType.Finished:
      return "Finalitzada";
    default:
      return "";
  }
};

export const formatDate = (
  dateString: any,
  includeHours: boolean = true,
  includeSeconds: boolean = true
) => {
  if (dateString === null) {
    return "";
  }
  const options: any = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: includeHours ? "2-digit" : undefined,
    minute: includeHours ? "2-digit" : undefined,
    second: includeSeconds ? "2-digit" : undefined,
    hour12: false,
  };
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return null;
  }

  const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(date);
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

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validDomains = [
    "gmail.com",
    "hotmail.com",
    "hotmail.es",
    "hotmail.fr",
    "hotmail.it",
    "yahoo.es",
    "yahoo.com",
    "icloud.com",
    "holaglow.com",
    "outlook.com",
    "outlook.es",
    "live.com",
    "me.com",
    "msn.com",
    "telefonica.net",
  ];

  const isValidFormat = emailRegex.test(email);

  if (!isValidFormat) {
    return false;
  }

  const [, domain] = email.split("@");
  const isDomainValid = validDomains.includes(domain);

  return isDomainValid;
};

export const isOperatorLogged = () => {
  const { operatorLogged } = useSessionStore((state) => state);

  return operatorLogged == undefined ? false : true;
};

export function checkOperatorCreated() {
  if (!isOperatorLogged) {
    alert("Operari no assignat");
    return false;
  } else {
    return true;
  }
}

export function startOrEndDate(date: Date, start: boolean): Date {
  const modifiedDate = new Date(date); // Make a copy of the original date

  // Conditionally set hours, minutes, seconds, and milliseconds
  if (start) {
    modifiedDate.setHours(0, 0, 0, 0); // Start of the day
  } else {
    modifiedDate.setUTCHours(23, 59, 59, 999); // End of the day in UTC
  }

  return modifiedDate; // Return the modified date
}

export function formatDateQuery(date: Date, startDate: boolean) {
  const formated = new Date(date);
  if (startDate) {
    formated.setHours(0, 0, 0, 0);
  } else {
    formated.setHours(23, 59, 59, 999);
  }

  return new Date(
    formated.getTime() - formated.getTimezoneOffset() * 60000
  ).toISOString();
}

export const translateOperatorType = (operatorType: any): string => {
  switch (operatorType) {
    case OperatorType.Maintenance:
      return "Manteniment";
    case OperatorType.Production:
      return "Producció";
    case OperatorType.Quality:
      return "Qualitat";
    default:
      return "";
  }
};
