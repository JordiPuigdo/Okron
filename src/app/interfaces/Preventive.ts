import Machine from "./machine";
import SparePart from "./SparePart";
import InspectionPoint from "./inspectionPoint";
import Operator from "./Operator";
import { Asset } from "./Asset";

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
    assetId? : string[],
    asset : Asset
    active : boolean
}



export interface CreatePreventiveRequest {
    code : string,
    description : string,
    machineId? : string[],
    startExecution : Date,
    days : number,
    counter : number,
    inspectionPointId : string[],
    operatorId : string[]
    assetId : string[]  
}

export interface UpdatePreventiveRequest extends CreatePreventiveRequest {
    id : string,
    active : boolean
    
}

export interface GetWOByPreventiveIdRequest {
    preventiveId : string
    startTime : Date,
    endTime : Date  
}