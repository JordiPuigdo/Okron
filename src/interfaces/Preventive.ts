import Machine from "./machine";
import SparePart from "./SparePart";
import InspectionPoint from "./inspectionPoint";
import Operator from "./Operator";

export interface Preventive {
    id: string
    serialNumber : string;
    code : string,
    description : string,
    machine : Machine,
    startExecution : Date,
    lastExecution : Date,
    hours : number,
    counter : number,
    inspectionPoints : InspectionPoint[],
    spareParts : SparePart[]
    operators : Operator[],
}


export interface CreatePreventiveRequest {
    serialNumber : string,
    code : string,
    description : string,
    machineId : string[],
    startExecution : Date,
    hours : number,
    counter : number,
    inspectionPointId : string[],
    sparePartId : string[],
    operatorId : string[]
}

export interface UpdatePreventiveRequest extends CreatePreventiveRequest {
    id : string;
}