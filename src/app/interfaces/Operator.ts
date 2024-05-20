
interface Operator {
  id: string;
  code: string;
  name: string;
  priceHour: number;
  operatorType: OperatorType; 
}

export enum OperatorType {
  Maintenance,
  Production,
  Quality,
}


export default Operator;