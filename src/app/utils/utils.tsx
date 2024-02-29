import { StateWorkOrder, WorkOrderType } from "app/interfaces/workOrder";
import { useSessionStore } from "app/stores/globalStore";

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
