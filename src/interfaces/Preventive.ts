import Machine from "./machine";
import SparePart from "./SparePart";
import InspectionPoint from "./inspectionPoint";
import Operator from "./Operator";

export interface Preventive {
    id: string
    code : string,
    description : string,
    machine : Machine,
    startExecution : Date,
    lastExecution : Date,
    hours? : number,
    days : number,
    counter : number,
    inspectionPoints : InspectionPoint[],
    spareParts : SparePart[]
    operators : Operator[],
}


export interface CreatePreventiveRequest {
    code : string,
    description : string,
    machineId : string[],
    startExecution : Date,
    days : number,
    counter : number,
    inspectionPointId : string[],
    sparePartId : string[],
    operatorId : string[]
}

export interface UpdatePreventiveRequest extends CreatePreventiveRequest {
    id : string;
}