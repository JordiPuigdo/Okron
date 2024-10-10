export interface Column {
  label: string;
  key: string;
  format: ColumnFormat;
  width?: string;
}

export interface Filters {
  label: string;
  key: string;
  format: FiltersFormat;
  value?: any;
}

export enum FiltersFormat {
  TEXT = "TEXT",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
}

export interface TableButtons {
  edit?: boolean;
  delete?: boolean;
  detail?: boolean;
}

export enum ColumnFormat {
  ANY = "ANY",
  DATE = "DATE",
  DATETIME = "DATETIME",
  BOOLEAN = "BOOLEAN",
  TEXT = "TEXT",
  TEXTRIGHT = "TEXTRIGHT",
  NUMBER = "NUMBER",
  WORKORDERTYPE = "WORKORDERTYPE",
  STATEWORKORDER = "STATEWORKORDER",
  KEY = "KEY",
  OPERATORTYPE = "OPERATORTYPE",
}
