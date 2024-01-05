import React, { useState, useEffect } from "react";
import Machine from "../../../interfaces/machine";
import WorkOrder, {
  CreateWorkOrderRequest,
  stateWorkOrder,
} from "../../../interfaces/workOrder";
import Layout from "components/Layout";
import MachineService from "../../../services/machineService";
import WorkOrderService from "services/workOrderService";
import { triggerAsyncId } from "async_hooks";
import WorkOrdersPerMachine from "./WorkOrdersPerMachine";
import WorkOrderForm from "./WorkOrderForm";

const MachineWorkOrdersPage: React.FC = () => {
  const [machines, setMachines] = useState<Machine[] | []>([]);
  const machineService = new MachineService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [WorkOrderVisibility, setWorkOrderVisibility] = useState<{
    [machineId: string]: boolean;
  }>({});
  const [createWorkOrderVisibility, setCreateWorkOrderVisibility] = useState<{
    [machineId: string]: boolean;
  }>({});
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [WorkOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);
  const [WorkOrder, setWorkOrder] = useState<WorkOrder | undefined>(undefined);
  const [showDetailWorkOrder, setShowDetailWorkOrder] = useState<
    boolean | undefined
  >(false);
  const [currentMachineId, setCurrentMachineId] = useState<string | "">("");
  const [currenMachineName, setCurrentMachineName] = useState<string | "">("");

  const formatDate = (dateString: any) => {
    if (dateString === null) {
      return "";
    }
    const options: any = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString("es-ES", options);
  };

  function formatTime(durationString: string) {
    if (durationString === null) {
      return "";
    }
    const durationDate = new Date(`1970-01-01T${durationString}Z`);

    const formatter = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    });

    const formattedTime = formatter.format(durationDate);

    return formattedTime;
  }

  const loadMachines = async () => {
    try {
      const machinesData = await machineService.getAllMachines();
      const activeMachines = machinesData.filter((machine) => machine.active);
      setMachines(activeMachines);
    } catch (error) {
      console.error("Error fetching machine WorkOrders:", error);
    }
  };

  const handleDetailClick = (WorkOrder: WorkOrder) => {
    loadWorkOrder(WorkOrder.id);
  };

  const loadWorkOrder = async (id: string) => {
    try {
      if (showDetailWorkOrder) {
        setShowDetailWorkOrder(false);
        return;
      }
      if (id != undefined) {
        await workOrderService
          .getWorkOrderById(id)
          .then((data) => {
            setWorkOrder(data);
            setShowDetailWorkOrder(true);
          })
          .catch((error) => {
            console.error("Error loading WorkOrder:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching WorkOrder:", error);
    }
  };
  useEffect(() => {
    loadMachines();
  }, []);

  const toggleWorkOrderVisibility = (machineId: string) => {
    console.log(machineId);
    setWorkOrderVisibility((prevState) => {
      const updatedVisibility = { ...prevState };
      if (updatedVisibility[machineId]) {
        updatedVisibility[machineId] = false;
      } else {
        for (const id in updatedVisibility) {
          updatedVisibility[id] = false;
        }
        updatedVisibility[machineId] = true;
      }

      return updatedVisibility;
    });

    setCreateWorkOrderVisibility((prevState) => {
      return {
        ...prevState,
        [machineId]: false,
      };
    });

    const machineSelected =
      machines.find((machine) => machine.id === machineId) || null;

    setCurrentMachineId(machineId);
    setCurrentMachineName(machineSelected?.name || "");
  };

  const toggleCreationVisibility = (machineId: string) => {
    setCreateWorkOrderVisibility((prevState) => {
      const updatedVisibility = { ...prevState };

      if (updatedVisibility[machineId]) {
        updatedVisibility[machineId] = false;
      } else {
        for (const id in updatedVisibility) {
          updatedVisibility[id] = false;
        }
        updatedVisibility[machineId] = true;
      }

      return updatedVisibility;
    });

    setWorkOrderVisibility((prevState) => {
      return {
        ...prevState,
        [machineId]: false,
      };
    });

    const machineSelected =
      machines.find((machine) => machine.id === machineId) || null;

    setCurrentMachineId(machineId);
    setCurrentMachineName(machineSelected?.name || "");
  };

  const handleWorkOrderSubmit = async (
    createWorkOrderRequest: CreateWorkOrderRequest,
    machine: Machine | null
  ) => {
    try {
      createWorkOrderRequest.machineId = machine?.id || "";
      await machineService.createMachineWorkOrder(
        createWorkOrderRequest,
        machine?.id || ""
      );
      loadMachines();
      setCreateWorkOrderVisibility((prevState) => ({
        ...prevState,
        [machine?.id || ""]: false,
      }));
    } catch (error) {
      console.error("Error creating machine WorkOrder:", error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-4">
        Històric Ordres de treball
      </h1>
      <div className="flex">
        <div id="left" className="w-1/4 p-4">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className={`${
                WorkOrderVisibility[machine.id] ||
                createWorkOrderVisibility[machine.id]
                  ? "bg-red-200"
                  : ""
              } mb-4 p-4 border rounded-lg shadow-md`}
            >
              <h2 className="text-xl font-semibold mb-2">{machine.name}</h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mx-2 rounded-md w-24 h-10"
                onClick={() => toggleWorkOrderVisibility(machine.id)}
              >
                {WorkOrderVisibility[machine.id] ? "Ocultar" : "Històric"}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 mx-2 rounded-md w-24 h-10 mt-2"
                onClick={() => toggleCreationVisibility(machine.id)}
              >
                {createWorkOrderVisibility[machine.id] ? "Cancelar" : "Crear"}
              </button>
            </div>
          ))}
        </div>
        <div id="center" className="w-1/2 p-4">
          {WorkOrderVisibility[currentMachineId] && (
            <div>
              <WorkOrdersPerMachine
                id={currentMachineId}
                machineName="test"
                onDetailClick={handleDetailClick}
              ></WorkOrdersPerMachine>
            </div>
          )}
          {createWorkOrderVisibility[currentMachineId] && (
            <WorkOrderForm
              onSubmit={(WorkOrderRequest) =>
                handleWorkOrderSubmit(
                  WorkOrderRequest,
                  machines.find((machine) => machine.id === currentMachineId) ||
                    null
                )
              }
              machineName={currenMachineName}
            />
          )}
        </div>
        <div id="right" className="w-1/3 p-4">
          {showDetailWorkOrder && WorkOrder?.description && (
            <div>
              <div className="flex font-bold mb-2">
                <div className="w-1/3">Inici</div>
                <div className="w-1/3">Final</div>
                <div className="w-1/3">Temps Total</div>
                <div className="w-1/3">Operari</div>
              </div>

              {WorkOrder?.WorkOrderTimes.map((WorkOrderTime) => (
                <div key={WorkOrderTime.id} className="flex items-center mb-2">
                  <div className="w-1/3">
                    {formatDate(WorkOrderTime.startTime)}
                  </div>
                  <div className="w-1/3">
                    {formatDate(WorkOrderTime.endTime)}
                  </div>
                  <div className="w-1/3">
                    {formatTime(WorkOrderTime.totalTime)}
                  </div>
                  <div className="w-1/3">{WorkOrderTime.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MachineWorkOrdersPage;
