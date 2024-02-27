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