import Machine from "./machine";
import SparePart from "./SparePart";
import InspectionPoint from "./inspectionPoint";

export interface Preventive {
    id: string
    code : string,
    description : string,
    machine : Machine,
    startExecution : Date,
    lastExecution : Date,
    hours : number,
    inspectionPoints : InspectionPoint[],
    spareParts : SparePart[]
}


export interface CreatePreventiveRequest {
    code : string,
    description : string,
    machineId : string[],
    startExecution : Date,
    hours : number,
    inspectionPointId : string[],
    sparePartId : string[]
}

export interface UpdatePreventiveRequest extends CreatePreventiveRequest {
    id : string;
}