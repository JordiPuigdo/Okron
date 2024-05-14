import {
  SvgCheck,
  SvgDelete,
  SvgDetail,
  SvgInspectionPoints,
  SvgPause,
  SvgSparePart,
  SvgSpinner,
  SvgStart,
} from "app/icons/icons";
import { UserPermission } from "app/interfaces/User";
import WorkOrder, {
  StateWorkOrder,
  UpdateStateWorkOrder,
  WorkOrderType,
} from "app/interfaces/workOrder";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import useRoutes from "app/utils/useRoutes";
import { checkAllInspectionPoints } from "app/utils/utilsInspectionPoints";
import { startOrFinalizeTimeOperation } from "app/utils/utilsOperator";
import { Button } from "designSystem/Button/Buttons";
import React, { useEffect, useState } from "react";

interface WorkOrderOperationsInTableProps {
  workOrderId: string;
  workOrder: WorkOrder;
  onChangeStateWorkOrder?: () => void;
}

export default function WorkOrderOperationsInTable({
  workOrderId,
  workOrder,
  onChangeStateWorkOrder,
}: WorkOrderOperationsInTableProps) {
  const [isPassInspectionPoints, setIsPassInspectionPoints] =
    React.useState(false);
  const [isOperatorInWorkOrder, setIsOperatorInWorkOrder] =
    React.useState(false);

  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );

  const Routes = useRoutes();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const { operatorLogged, loginUser } = useSessionStore((state) => state);

  function handleInspectionPoints(workOrderId: string) {
    toggleLoading(workOrderId + "_InspectionPoints");
    checkAllInspectionPoints(workOrder.workOrderInspectionPoint!, workOrderId);
    setIsPassInspectionPoints(!isPassInspectionPoints);
    toggleLoading(workOrderId + "_InspectionPoints");
    setIsPassInspectionPoints(!isPassInspectionPoints);
  }

  const toggleLoading = (id: string) => {
    setIsLoading((prevLoading) => ({
      ...prevLoading,
      [id]: !prevLoading[id],
    }));
  };

  useEffect(() => {
    if (workOrder.stateWorkOrder == StateWorkOrder.Finished) return;
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
          time.operator.id == operatorLogged?.idOperatorLogged &&
          (time.endTime == undefined || time.endTime == null)
      );
      setIsOperatorInWorkOrder(isInWorkOrder);
    }
  }, []);

  async function handleChangeStateWorkOrder(state: StateWorkOrder) {
    toggleLoading(
      workOrderId +
        (state === StateWorkOrder.PendingToValidate ? "_Validate" : "_Sign")
    );

    if (!operatorLogged) {
      alert("Has de tenir un operari fitxat per fer aquesta acció");
      return;
    }
    if (workOrder.stateWorkOrder == state) {
      return;
    }

    const update: UpdateStateWorkOrder = {
      workOrderId: workOrder.id,
      state: state,
      operatorId: operatorLogged?.idOperatorLogged,
      userId: loginUser?.agentId,
    };
    await workOrderService.updateStateWorkOrder(update).then((response) => {
      if (response) {
        if (state !== StateWorkOrder.PendingToValidate) {
          setIsOperatorInWorkOrder(!isOperatorInWorkOrder);
        }

        workOrder.stateWorkOrder = state;
        onChangeStateWorkOrder && onChangeStateWorkOrder();
      } else {
        //     setErrorMessage("Error actualitzant el treball");
      }
    });
    toggleLoading(
      workOrderId +
        (state === StateWorkOrder.PendingToValidate ? "_Validate" : "_Sign")
    );
  }

  if (workOrder.stateWorkOrder !== StateWorkOrder.Finished)
    return (
      <div className="flex w-full gap-2">
        <Button
          type="none"
          onClick={() => {
            isOperatorInWorkOrder
              ? handleChangeStateWorkOrder(StateWorkOrder.Paused)
              : handleChangeStateWorkOrder(StateWorkOrder.OnGoing);
          }}
          disabled={
            workOrder.stateWorkOrder == StateWorkOrder.PendingToValidate
          }
          className={`${
            isOperatorInWorkOrder ? "bg-emerald-700" : "bg-rose-700"
          } hover:${
            isOperatorInWorkOrder ? "bg-emerald-900" : "bg-rose-900"
          } text-white p-4 rounded flex gap-1 w-full justify-center items-center `}
        >
          {isLoading[workOrderId + "_Sign"] ? (
            <SvgSpinner className="w-6 h-6 text-white" />
          ) : isOperatorInWorkOrder ? (
            <SvgPause className="text-white" />
          ) : (
            <SvgStart />
          )}
        </Button>

        <div
          className={`${
            workOrder.stateWorkOrder == StateWorkOrder.PendingToValidate
              ? "bg-emerald-700"
              : "bg-rose-700"
          } hover:${
            workOrder.stateWorkOrder == StateWorkOrder.PendingToValidate
              ? "bg-emerald-900 pointer-events-none"
              : "bg-rose-900"
          } text-white p-4 rounded flex gap-1 w-full justify-center `}
        >
          <Button
            type="none"
            customStyles={`${
              workOrder.stateWorkOrder == StateWorkOrder.PendingToValidate &&
              "pointer-events-none"
            }`}
            onClick={() => {
              if (
                workOrder.stateWorkOrder != StateWorkOrder.PendingToValidate
              ) {
                handleChangeStateWorkOrder(StateWorkOrder.PendingToValidate);
              }
            }}
          >
            {isLoading[workOrderId + "_Validate"] ? (
              <SvgSpinner className="w-6 h-6" />
            ) : (
              <SvgCheck />
            )}
          </Button>
        </div>

        {workOrder.workOrderType == WorkOrderType.Corrective && (
          <div className="bg-gray-500 p-4 w-full text-white rounded flex gap-1 justify-center">
            <Button
              disabled={isPassInspectionPoints}
              onClick={() => {
                handleInspectionPoints(workOrderId);
              }}
              type="none"
            >
              {isLoading[workOrderId + "_InspectionPoints"] ? (
                <SvgSpinner className="w-6 h-6" />
              ) : (
                <SvgSparePart />
              )}
            </Button>
          </div>
        )}
        {workOrder.workOrderType == WorkOrderType.Preventive && (
          <div
            className={`${
              isPassInspectionPoints ? "bg-lime-700" : "bg-red-500"
            } hover:${
              isPassInspectionPoints
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-red-700"
            } text-white rounded p-4 flex gap-2 justify-center align-middle w-full`}
          >
            <Button
              disabled={isPassInspectionPoints}
              onClick={() => {
                handleInspectionPoints(workOrderId);
              }}
              type="none"
              customStyles="text-xl"
            >
              {isLoading[workOrderId + "_InspectionPoints"] ? (
                <SvgSpinner className="w-6 h-6" />
              ) : (
                <SvgInspectionPoints />
              )}
            </Button>
          </div>
        )}
        <div
          className={`bg-okron-btDetail hover:bg-okron-btnDetailHover rounded text-center p-4 w-full`}
        >
          <Button
            type="none"
            onClick={() => {
              toggleLoading(workOrderId + "_Detail");
            }}
            href={`${Routes.workOrders + "/" + workOrder.id}`}
          >
            {isLoading[workOrderId + "_Detail"] ? (
              <div className="flex">
                <SvgSpinner className="w-6 h-6" />
              </div>
            ) : (
              <SvgDetail />
            )}
          </Button>
        </div>
      </div>
    );
  else return <></>;
}
