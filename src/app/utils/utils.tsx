import { OperatorType } from "app/interfaces/Operator";
import {
  StateWorkOrder,
  WorkOrderEventType,
  WorkOrderType,
} from "app/interfaces/workOrder";
import { useSessionStore } from "app/stores/globalStore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
    case WorkOrderEventType.Created:
      return "Creada";
    default:
      return "";
  }
};

export const formatDate = (
  dateString: any,
  includeHours: boolean = true,
  includeSeconds: boolean = true
) => {
  if (!dateString) {
    return "";
  }
  if (dateString.length > 0 && dateString.includes("0001")) {
    return "";
  }
  const newDate = new Date(dateString);
  const date = dayjs(newDate);

  if (!date.isValid()) {
    return "";
  }

  let formatString = "DD/MM/YYYY";

  if (includeHours) {
    formatString += " HH:mm";
    if (includeSeconds) {
      formatString += ":ss";
    }
  }

  return date.format(formatString);
};

export const translateWorkOrderType = (
  workOrderType: WorkOrderType
): string => {
  const translations: { [key in WorkOrderType]: string } = {
    [WorkOrderType.Preventive]: "Preventiu",
    [WorkOrderType.Corrective]: "Correctiu",
    [WorkOrderType.Predicitve]: "",
  };

  return translations[workOrderType];
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

export function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000
  );

  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export function differenceBetweenDates(date1: Date, date2: Date) {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (num: number) => num.toString().padStart(2, "0");
  const fullTime = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  return {
    days,
    hours,
    minutes,
    seconds,
    fullTime,
  };
}
