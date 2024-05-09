import { Asset } from "./Asset";
import { Documentation } from "./Documentation";
import Operator from "./Operator";
import Machine from "./machine";
import WorkOrder from "./workOrder";

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
    documentation : Documentation[];
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
    sparePartPerMachineResponse : SparePartPerAssetResponse[];
}   

export interface SparePartPerAssetResponse {
    id : string; 
    operatorName : string;
    sparePartQuantity : number;
    sparePartCode :string;
    sparePartDescription : string;
    workOrderCode : string;
    workOrderDescription : string
}

interface SparePartsConsumeds {
    quantity : number;
    operator : Operator
    creationDate : string;
    sparePart : SparePart;
}

export interface SparePartDetailRequest {
    id?: string;
    startDate : string;
    endDate : string;
    machineId? : string;
    assetId? : string;
}