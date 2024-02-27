import React from "react";
import InspectionPoint from "app/interfaces/inspectionPoint";
import { WorkOrderInspectionPoint } from "app/interfaces/workOrder";

interface PassInspectionPointProps {
  availableInspectionPoints: InspectionPoint[];
  completedWorkOrderInspectionPoints: WorkOrderInspectionPoint[];
  setCompletedWorkOrderInspectionPoints: React.Dispatch<
    React.SetStateAction<WorkOrderInspectionPoint[]>
  >;
  WordOrderId: string;
}

const PassInspectionPointProps: React.FC<PassInspectionPointProps> = ({
  availableInspectionPoints,
  completedWorkOrderInspectionPoints,
  setCompletedWorkOrderInspectionPoints,
  WordOrderId,
}) => {
  const handleSelectInspectionPoint = (inspectionPoint: InspectionPoint) => {
    const updatedPoints = [
      ...completedWorkOrderInspectionPoints,
      {
        id: inspectionPoint.id,
        workOrderId: WordOrderId,
        // Add other properties here as needed
      },
    ];
    //setCompletedWorkOrderInspectionPoints(updatedPoints);
  };

  return (
    <div>
      <h2>Available Inspection Points</h2>
      <ul>
        {availableInspectionPoints.map((inspectionPoint) => (
          <li key={inspectionPoint.id}>
            {inspectionPoint.description}{" "}
            <button
              onClick={() => handleSelectInspectionPoint(inspectionPoint)}
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PassInspectionPointProps;
