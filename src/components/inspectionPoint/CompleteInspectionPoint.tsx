import React, { useState } from "react";
import {
  ResultInspectionPoint,
  SaveInspectionResultPointRequest,
  WorkOrderInspectionPoint,
} from "app/interfaces/workOrder";
import WorkOrderService from "components/services/workOrderService";
import { SvgSpinner } from "app/icons/icons";
import { useSessionStore } from "app/stores/globalStore";

interface CompleteInspectionPoints {
  workOrderInspectionPoints: WorkOrderInspectionPoint[];
  setCompletedWorkOrderInspectionPoints: React.Dispatch<
    React.SetStateAction<WorkOrderInspectionPoint[]>
  >;
  workOrderId: string;
  isFinished: boolean;
}

const CompleteInspectionPoints: React.FC<CompleteInspectionPoints> = ({
  workOrderInspectionPoints,
  setCompletedWorkOrderInspectionPoints,
  workOrderId,
  isFinished,
}) => {
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { operatorLogged } = useSessionStore((state) => state);

  const handleSelectInspectionPoint = async (
    inspectionPoint: WorkOrderInspectionPoint,
    e: any
  ) => {
    if (operatorLogged == undefined) {
      alert("Has de tenir un operari fitxat per fer aquesta acció!");
      return;
    }
    setIsLoading((prevLoadingMap) => ({
      ...prevLoadingMap,
      [inspectionPoint.id]: true,
    }));
    const saveInspectionPointResult: SaveInspectionResultPointRequest = {
      WorkOrderId: workOrderId,
      WorkOrderInspectionPointId: inspectionPoint.id,
      resultInspectionPoint:
        e == true ? ResultInspectionPoint.Ok : ResultInspectionPoint.NOk,
    };
    await workOrderService
      .saveInspectionPointResult(saveInspectionPointResult)
      .then((response) => {
        setCompletedWorkOrderInspectionPoints((prevSelected) =>
          prevSelected.map((point) =>
            point.id === inspectionPoint.id ? { ...point, check: e } : point
          )
        );
      })
      .catch((error) => {
        setIsLoading((prevLoadingMap) => ({
          ...prevLoadingMap,
          [inspectionPoint.id]: false,
        }));
        console.log("Error insepctionPoint: " + error);
      });
    setIsLoading((prevLoadingMap) => ({
      ...prevLoadingMap,
      [inspectionPoint.id]: false,
    }));
  };

  const handleResetInspectionPoint = async (
    inspectionPoint: WorkOrderInspectionPoint
  ) => {
    if (operatorLogged == undefined) {
      alert("Has de tenir un operari fitxat per fer aquesta acció!");
      return;
    }
    setIsLoading((prevLoadingMap) => ({
      ...prevLoadingMap,
      [inspectionPoint.id]: true,
    }));
    const x = undefined;

    const saveInspectionPointResult: SaveInspectionResultPointRequest = {
      WorkOrderId: workOrderId,
      WorkOrderInspectionPointId: inspectionPoint.id,
      resultInspectionPoint: ResultInspectionPoint.Pending,
    };
    await workOrderService
      .saveInspectionPointResult(saveInspectionPointResult)
      .then((response) => {
        setCompletedWorkOrderInspectionPoints((prevSelected) =>
          prevSelected.map((point) =>
            point.id === inspectionPoint.id ? { ...point, check: x } : point
          )
        );
      })
      .catch((error) => {
        setIsLoading((prevLoadingMap) => ({
          ...prevLoadingMap,
          [inspectionPoint.id]: false,
        }));
        console.log("Error Operaris: " + error);
      });
    setIsLoading((prevLoadingMap) => ({
      ...prevLoadingMap,
      [inspectionPoint.id]: false,
    }));
  };

  return (
    <div className="mx-auto px-4 py-8 mt-12">
      <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-400">
        <span className="text-xl font-bold">Passar Punts d'Inspecció</span>
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
                    disabled={isFinished}
                    type="checkbox"
                    checked={inspectionPoint.check || false}
                    onChange={(event) => {
                      handleSelectInspectionPoint(
                        inspectionPoint,
                        event.target.checked
                      );
                    }}
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
                    disabled={isFinished}
                    type="button"
                    className="border border-gray-700 rounded-xl p-2 gap-2 bg-slate-500 text-white w-full text-lg flex items-center justify-center"
                  >
                    Reset
                    {isLoading[inspectionPoint.id] && <SvgSpinner />}
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
