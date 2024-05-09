import { ResultInspectionPoint, SaveInspectionResultPointRequest, WorkOrderInspectionPoint } from "app/interfaces/workOrder";
import WorkOrderService from "app/services/workOrderService";

  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  
  export function checkAllInspectionPoints(workOrderInspectionPoints : WorkOrderInspectionPoint[], workOrderId : string) : WorkOrderInspectionPoint[]{ 
    workOrderInspectionPoints.forEach((inspectionPoint) => {
      const saveInspectionPointResult: SaveInspectionResultPointRequest = {
        WorkOrderId: workOrderId,
        WorkOrderInspectionPointId: inspectionPoint.id,
        resultInspectionPoint: ResultInspectionPoint.Ok,
      };
      workOrderService
        .saveInspectionPointResult(saveInspectionPointResult)
        .then((response) => {
          
        })
        .catch((error) => {
          console.log("Error insepctionPoint: " + error);
        });
    });
    const updatedPoints = workOrderInspectionPoints.map((inspectionPoint) => ({
        ...inspectionPoint,
        check: true,
    }));

    return updatedPoints;
  }