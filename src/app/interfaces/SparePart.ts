import Operator from "./Operator";
import Machine from "./machine";

interface SparePart {
    id: string;
    code: string;
    description: string;
    refProvider: string;
    family: string;
    ubication : string;
    stock: number;
    brand: string;
    unitsConsum? : number;
    price : number;
    active : boolean
}

export default SparePart;

export interface RestoreSparePart extends ConsumeSparePart{
}

export interface ConsumeSparePart {
    workOrderId : string;
    sparePartId : string;
    unitsSparePart : number;
    operatorId : string
}

export interface CreateSparePartRequest {
    code: string;
    description: string;
    refProvider: string;
    family: string;
    ubication? : string;
    stock?: number;
    brand?: string;
}

export interface SparePartDetailResponse {
    sparePart : SparePart;
    sparePartPerMachineResponse : SparePartPerMachineResponse[];
}   

export interface SparePartPerMachineResponse {
    machine : Machine;
    workOrderId : string;
    spareParts : SparePartsConsumeds[];
}

interface SparePartsConsumeds {
    quantity : number;
    operator : Operator
    creationDate : string;
    sparePart : SparePart;
}

export interface SparePartDetailRequest {
    id: string;
    startDate : string;
    endDate : string;
}