import React from "react";
import { WorkOrderInspectionPoint } from "interfaces/workOrder";

interface CompleteInspectionPoints {
  workOrderInspectionPoints: WorkOrderInspectionPoint[];
  setCompletedWorkOrderInspectionPoints: React.Dispatch<
    React.SetStateAction<WorkOrderInspectionPoint[]>
  >;
}

const CompleteInspectionPoints: React.FC<CompleteInspectionPoints> = ({
  workOrderInspectionPoints,
  setCompletedWorkOrderInspectionPoints,
}) => {
  const handleSelectInspectionPoint = (
    inspectionPoint: WorkOrderInspectionPoint,
    e: any
  ) => {
    setCompletedWorkOrderInspectionPoints((prevSelected) =>
      prevSelected.map((point) =>
        point.id === inspectionPoint.id ? { ...point, check: e } : point
      )
    );
  };

  const handleResetInspectionPoint = (
    inspectionPoint: WorkOrderInspectionPoint
  ) => {
    const x = undefined;
    setCompletedWorkOrderInspectionPoints((prevSelected) =>
      prevSelected.map((point) =>
        point.id === inspectionPoint.id ? { ...point, check: x } : point
      )
    );
  };

  return (
    <div className="mx-auto px-4 py-8 mt-12">
      <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-400">
        <span className="text-xl font-bold">Punts de Inspecció</span>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 font-bold text-lg">Check</th>
              <th className="py-2 px-4 font-bold text-lg">Punt de inspecció</th>
              <th className="py-2 px-4 font-bold text-lg">Reset</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {workOrderInspectionPoints.map((inspectionPoint) => (
              <tr
                key={inspectionPoint.id}
                className={
                  inspectionPoint.check === false
                    ? "bg-red-100"
                    : inspectionPoint.check === true
                    ? "bg-green-100"
                    : "bg-orange-100"
                }
              >
                <td className="py-2 px-4 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={inspectionPoint.check || false}
                    onChange={(event) =>
                      handleSelectInspectionPoint(
                        inspectionPoint,
                        event.target.checked
                      )
                    }
                    className="w-6 h-6 cursor-pointer"
                  />
                </td>
                <td className="py-2 px-4 text-center align-middle text-lg">
                  {inspectionPoint.inspectionPoint.description}
                </td>
                <td
                  className="py-2 px-4 text-center align-middle"
                  onClick={() => {
                    handleResetInspectionPoint(inspectionPoint);
                  }}
                >
                  <button
                    type="button"
                    className="border border-gray-700 rounded-xl p-2 gap-2 bg-slate-500 text-white w-full text-lg"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
    </div>
  );
};

export default CompleteInspectionPoints;
