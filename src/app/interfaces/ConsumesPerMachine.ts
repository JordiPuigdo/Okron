import Machine from "./machine";

export interface ConsumesPerMachine {
    machine : Machine
    spareParts : MachineSparePart[]
}

interface MachineSparePart {
    quantity: number;
    creationDate : string;
}