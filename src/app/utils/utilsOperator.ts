import Operator from "app/interfaces/Operator";
import { AddWorkOrderOperatorTimes, FinishWorkOrderOperatorTimes, UpdateWorkOrderOperatorTimes, WorkOrderOperatorTimes } from "app/interfaces/workOrder";
import OperatorService from "app/services/operatorService";
import WorkOrderService from "app/services/workOrderService";



export async function startOrFinalizeTimeOperation(
  workOrderOperatortimes: WorkOrderOperatorTimes[],
  workOrderId: string,
  operatorId: string
): Promise<void> {
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );


  const lastOperation = workOrderOperatortimes.find(
    (time) =>
      time.operator.id === operatorId &&
      (time.endTime === undefined || time.endTime === null)
  );

  if (lastOperation) {
    const finishTime = new Date();
    const finishData: FinishWorkOrderOperatorTimes = {
      WorkOrderId: workOrderId,
      operatorId: operatorId,
      finishTime: finishTime,
    };

    workOrderService
      .finishWorkOrderOperatorTimes(finishData)
      .then(() => {
        // Update the last operation in the local array
        const updatedOperations = workOrderOperatortimes.map((time) =>
          time.id === lastOperation.id
            ? { ...time, endTime: finishTime }
            : time
        );
        // Update the state with the updated array of operations
        // setWorkOrderOperatorTimes(updatedOperations);
      })
      .catch((error) => {
        console.log('Error finishing operation:', error);
      });
  } else {
    // Start a new operation
    const startTime = new Date();
    const newOperationData: AddWorkOrderOperatorTimes = {
      WorkOrderId: workOrderId,
      operatorId: operatorId,
      startTime: startTime,
    };

    
    workOrderService
      .addWorkOrderOperatorTimes(newOperationData)
      .then((response) => {
       
      })
      .catch((error) => {
        console.log('Error starting new operation:', error);
      });
  }
}
