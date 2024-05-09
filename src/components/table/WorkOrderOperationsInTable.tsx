import { SvgSpinner } from "app/icons/icons";
import WorkOrder, { WorkOrderType } from "app/interfaces/workOrder";
import { useSessionStore } from "app/stores/globalStore";
import { checkAllInspectionPoints } from "app/utils/utilsInspectionPoints";
import { startOrFinalizeTimeOperation } from "app/utils/utilsOperator";
import { Button } from "designSystem/Button/Buttons";
import React, { useEffect, useState } from "react";

interface WorkOrderOperationsInTableProps {
  workOrderId: string;
  workOrder: WorkOrder;
}

export default function WorkOrderOperationsInTable({
  workOrderId,
  workOrder,
}: WorkOrderOperationsInTableProps) {
  const [isPassInspectionPoints, setIsPassInspectionPoints] =
    React.useState(false);
  const [isOperatorInWorkOrder, setIsOperatorInWorkOrder] =
    React.useState(false);

  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const { operatorLogged } = useSessionStore((state) => state);

  function handleInspectionPoints(workOrderId: string) {
    toggleLoading(workOrderId + "_InspectionPoints");
    checkAllInspectionPoints(workOrder.workOrderInspectionPoint!, workOrderId);
    setIsPassInspectionPoints(!isPassInspectionPoints);
    toggleLoading(workOrderId + "_InspectionPoints");
    setIsPassInspectionPoints(!isPassInspectionPoints);
  }

  function signOrLogoutOperator(workOrderId: string) {
    toggleLoading(workOrderId + "_Sign");
    if (operatorLogged !== undefined) {
      startOrFinalizeTimeOperation(
        workOrder.workOrderOperatorTimes!,
        workOrderId,
        operatorLogged.idOperatorLogged
      );
      setIsOperatorInWorkOrder(!isOperatorInWorkOrder);
    }
    toggleLoading(workOrderId + "_Sign");
  }

  const toggleLoading = (id: string) => {
    setIsLoading((prevLoading) => ({
      ...prevLoading,
      [id]: !prevLoading[id],
    }));
  };

  useEffect(() => {
    if (workOrder.workOrderType == WorkOrderType.Preventive) {
      const allInspectionPointsChecked =
        workOrder.workOrderInspectionPoint !== undefined
          ? workOrder.workOrderInspectionPoint.every(
              (inspectionPoint) => inspectionPoint.check
            )
          : false;
      setIsPassInspectionPoints(allInspectionPointsChecked ?? false);
    }

    if (
      workOrder.workOrderOperatorTimes !== undefined &&
      workOrder.workOrderOperatorTimes.filter((x) => x.endTime !== undefined)
    ) {
      const isInWorkOrder = workOrder.workOrderOperatorTimes?.some(
        (time) =>
          time.operator.id == operatorLogged!.idOperatorLogged &&
          (time.endTime == undefined || time.endTime == null)
      );
      setIsOperatorInWorkOrder(isInWorkOrder);
    }
  }, []);

  return (
    <div className="flex gap-2 items-center bg-">
      <Button
        customStyles={`${
          isOperatorInWorkOrder ? "bg-emerald-700" : "bg-rose-700"
        } hover:${
          isOperatorInWorkOrder ? "bg-emerald-900" : "bg-rose-900"
        } text-white py-2 px-4 rounded flex gap-2`}
        onClick={() => {
          signOrLogoutOperator(workOrderId);
        }}
      >
        {isOperatorInWorkOrder ? "S" : "E"}
        {isLoading[workOrderId + "_Sign"] && <SvgSpinner className="w-6 h-6" />}
      </Button>
      {workOrder.workOrderType == WorkOrderType.Preventive && (
        <Button
          disabled={isPassInspectionPoints}
          onClick={() => {
            handleInspectionPoints(workOrderId);
          }}
          customStyles={`${
            isPassInspectionPoints ? "bg-lime-700" : "bg-red-500"
          } hover:${
            isPassInspectionPoints
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-red-700"
          } text-white  py-2 px-4 rounded  flex gap-2`}
        >
          {isPassInspectionPoints ? "OK" : "KO"}
          {isLoading[workOrderId + "_InspectionPoints"] && (
            <SvgSpinner className="w-6 h-6" />
          )}
        </Button>
      )}
    </div>
  );
}
