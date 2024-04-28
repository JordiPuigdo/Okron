interface WorkOrderOperatorTime {
  startTime: Date;
  endTime: Date;
  operator: {
    priceHour: number;
  };
}

interface WorkOrderSparePart {
  sparePart: {
    price: number;
  };
}

interface ResponseWorkOrder {
  workOrderOperatorTimes?: WorkOrderOperatorTime[];
  workOrderSpareParts?: WorkOrderSparePart[];
}

function calculateTotalCost(responseWorkOrder: ResponseWorkOrder): void {
  const operatorTimes = responseWorkOrder.workOrderOperatorTimes || [];
  const spareParts = responseWorkOrder.workOrderSpareParts || [];

  if (operatorTimes.length === 0 && spareParts.length === 0) {
    console.log('No operator times or spare parts to calculate total cost.');
    return;
  }

  let totalCostOperators = 0;
  let totalCostSpareParts = 0;

  // Calculate total cost based on operator times
  operatorTimes.forEach((operatorTime) => {
    const startTime = operatorTime.startTime.getTime();
    const endTime = operatorTime.endTime.getTime();
    const hoursWorked = (endTime - startTime) / (1000 * 60 * 60); // Calculate hours worked
    const costForOperator = hoursWorked * operatorTime.operator.priceHour;
    totalCostOperators += costForOperator;
  });

  // Calculate total cost based on spare parts
  totalCostSpareParts = spareParts.reduce(
    (acc, sparePart) => acc + sparePart.sparePart.price,
    0
  );

  // Calculate overall total cost
  const totalCost = totalCostOperators + totalCostSpareParts;

  console.log(`Total Cost for Operators: $${totalCostOperators.toFixed(2)}`);
  console.log(`Total Cost for Spare Parts: $${totalCostSpareParts.toFixed(2)}`);
  console.log(`Overall Total Cost: $${totalCost.toFixed(2)}`);

  // Assuming setTotalCosts is a function to update state (e.g., in React)
  // setTotalCosts(totalCost);
}
