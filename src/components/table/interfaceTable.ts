export interface Column {
    label: string;
    key: string;
    format: ColumnFormat;
}


export interface Filters {
    label: string;
    key: string;
    format: FiltersFormat
    value? : any;
}


export enum FiltersFormat {
    TEXT = "TEXT",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
}


export interface  TableButtons {
    edit? : boolean
    delete? : boolean,
    detail? : boolean
}

export enum ColumnFormat {
    ANY = "ANY",
    DATE = "DATE",
    BOOLEAN = "BOOLEAN",    
    TEXT = "TEXT",
    WORKORDERTYPE = "WORKORDERTYPE",
    STATEWORKORDER = "STATEWORKORDER",

}