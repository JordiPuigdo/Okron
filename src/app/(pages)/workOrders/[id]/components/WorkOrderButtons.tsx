import { SvgSpinner } from "app/icons/icons";
import {
  StateWorkOrder,
  UpdateStateWorkOrder,
  WorkOrder,
} from "app/interfaces/workOrder";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { startOrFinalizeTimeOperation } from "app/utils/utilsOperator";
import { Button } from "designSystem/Button/Buttons";
import { useState } from "react";

interface WorkOrderButtonsProps {
  workOrder: WorkOrder;
  handleReload: () => void;
}

const WorkOrderButtons: React.FC<WorkOrderButtonsProps> = ({
  workOrder,
  handleReload,
}: WorkOrderButtonsProps) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const { loginUser, operatorLogged } = useSessionStore((state) => state);

  const toggleLoading = (id: StateWorkOrder) => {
    setIsLoading((prevLoading) => ({
      ...prevLoading,
      [id]: !prevLoading[id],
    }));
  };

  function handleChangeStateWorkOrder(state: StateWorkOrder) {
    if (!operatorLogged) {
      alert("Has de tenir un operari fitxat per fer aquesta acció");
      return;
    }
    if (workOrder.stateWorkOrder == state) {
      return;
    }
    toggleLoading(state);
    startOrFinalizeTimeOperation(
      workOrder.workOrderOperatorTimes!,
      workOrder.id,
      operatorLogged.idOperatorLogged,
      state
    );
    const update: UpdateStateWorkOrder = {
      workOrderId: workOrder.id,
      state: state,
      operatorId: operatorLogged?.idOperatorLogged,
      userId: loginUser?.agentId,
    };
    workOrderService.updateStateWorkOrder(update).then((response) => {
      if (response) {
        handleReload();
        toggleLoading(state);
      } else {
        setErrorMessage("Error actualitzant el treball");
        toggleLoading(state);
      }
    });
  }

  return (
    <div className="flex flex-row w-full py-4 justify-start gap-2">
      <Button
        onClick={() => handleChangeStateWorkOrder(StateWorkOrder.Waiting)}
        type="none"
        customStyles="flex justify-center items-center bg-okron-waiting h-24 w-24 rounded-xl shadow-md text-white font-semibold"
      >
        {isLoading[StateWorkOrder.Waiting] ? (
          <SvgSpinner className="text-white" />
        ) : (
          "Pendent"
        )}
      </Button>
      <Button
        onClick={() => handleChangeStateWorkOrder(StateWorkOrder.OnGoing)}
        type="none"
        customStyles="flex justify-center items-center bg-okron-onGoing h-24 w-24 rounded-xl shadow-md text-white font-semibold"
      >
        {isLoading[StateWorkOrder.OnGoing] ? (
          <SvgSpinner className="text-white" />
        ) : (
          "En Curs"
        )}
      </Button>
      <Button
        onClick={() => handleChangeStateWorkOrder(StateWorkOrder.Paused)}
        type="none"
        customStyles="flex justify-center items-center bg-gray-500 h-24 w-24 rounded-xl shadow-md text-white font-semibold"
      >
        {isLoading[StateWorkOrder.Paused] ? (
          <SvgSpinner className="text-white" />
        ) : (
          "Pausar"
        )}
      </Button>
      <Button
        onClick={() =>
          handleChangeStateWorkOrder(StateWorkOrder.PendingToValidate)
        }
        type="none"
        customStyles="flex justify-center items-center bg-okron-finished h-24 w-24 rounded-xl shadow-md text-white font-semibold"
      >
        {isLoading[StateWorkOrder.PendingToValidate] ? (
          <SvgSpinner className="text-white" />
        ) : (
          "Pendent Validar"
        )}
      </Button>
    </div>
  );
};

export default WorkOrderButtons;
