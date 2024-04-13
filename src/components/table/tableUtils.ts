import { entityStatusConfig } from "./EntityStatusConfig";

export function getStatusText(statusText: string, entity: string): string {
  const lowercaseStatus = statusText.toUpperCase();
  const config = entityStatusConfig[entity];
  if (config && lowercaseStatus in config.names) {
    return config.names[lowercaseStatus];
  }
  return statusText;
}

export const getStatusClassName = (status: string, entity: string): string => {
  const uppercaseStatus = status.toString().toUpperCase();
  const config = entityStatusConfig[entity];
  if (config && uppercaseStatus in config.colors) {
    const style = config.colors[uppercaseStatus];
    return `text-white rounded-full py-1 px-2 text-sm ${style}`;
  }
  return '';
};