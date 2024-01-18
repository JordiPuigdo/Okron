"use client";

import React, { useState, useEffect } from "react";
import Machine from "../../../interfaces/machine";
import WorkOrder, {
  CreateWorkOrderRequest,
  SearchWorkOrderFilters,
  StateWorkOrder,
  WorkOrderType,
} from "../../../interfaces/workOrder";
import Layout from "components/Layout";
import MachineService from "../../../services/machineService";
import WorkOrderService from "services/workOrderService";
import { triggerAsyncId } from "async_hooks";
import WorkOrdersPerMachine from "./WorkOrdersPerMachine";
import WorkOrderForm from "./[id]/WorkOrderForm";
import dayjs from "dayjs";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import Link from "next/link";

export default function MachineWorkOrdersPage() {
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
  const [workOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);
  const [workOrder, setWorkOrder] = useState<WorkOrder | undefined>(undefined);
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

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const searchWorkOrders = async () => {
    const startDateTime = startDate ? new Date(startDate) : null;
    const endDateTime = endDate ? new Date(endDate) : null;
    const machineId = currentMachineId;
    if (!machineId) {
      alert("Selecciona una màquina.");
      return;
    }
    if (startDateTime) {
      startDateTime.setHours(0, 0, 0, 0);
    }

    if (endDateTime) {
      endDateTime.setHours(23, 59, 59, 999);
    }
    const search: SearchWorkOrderFilters = {
      machineId: machineId,
      startTime: startDateTime ? startDateTime.toISOString() : "",
      endTime: endDateTime ? endDateTime.toISOString() : "",
    };

    const workOrders = await workOrderService.getWorkOrdersWithFilters(search);
    setWorkOrders(workOrders);
  };

  const translateState = (state: StateWorkOrder): string => {
    switch (state) {
      case StateWorkOrder.Waiting:
        return "Esperant";
      case StateWorkOrder.OnGoing:
        return "En curs";
      case StateWorkOrder.Paused:
        return "Pausada";
      case StateWorkOrder.Finished:
        return "Finalitzada";
      default:
        return "Error";
    }
  };

  const translateWorkOrderType = (type: WorkOrderType): string => {
    switch (type) {
      case WorkOrderType.Corrective:
        return "Correctiu";
      case WorkOrderType.Preventive:
        return "Preventiu";
      case WorkOrderType.Predicitve:
        return "Predictiu";
      default:
        return "Error";
    }
  };

  const handleEditOrder = (orderId: string) => {
    // Placeholder: Open a modal or navigate to an edit page
    console.log(`Editing work order with ID ${orderId}`);
    // Implement your logic here to open an edit modal or navigate to an edit page
  };

  const handleDeleteOrder = (orderId: string) => {
    // Placeholder: Show a confirmation dialog and delete the order if confirmed
    const isConfirmed = window.confirm(
      `Esteu segurs que voleu eliminar l'ordre de treball?`
    );

    if (isConfirmed) {
      workOrderService.deleteWorkOrder(orderId);
      setWorkOrders((prevWorkOrders) =>
        prevWorkOrders.filter((prevWorkOrders) => prevWorkOrders.id !== orderId)
      );
    } else {
      console.log(`Deletion of work order with ID ${orderId} canceled`);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-4">
        Històric Ordres de treball
      </h1>
      <div className="flex items-center text-black mb-4">
        <label htmlFor="machineSelect" className="mr-2">
          Màquina:
        </label>
        <select
          id="machineSelect"
          value={currentMachineId}
          onChange={(e) => setCurrentMachineId(e.target.value)}
          className="border border-gray-300 p-2 rounded-md mr-4"
        >
          <option value="" disabled>
            Selecciona la màquina
          </option>
          {machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name}
            </option>
          ))}
        </select>
        <div className="flex items-center">
          <label htmlFor="startDate" className="mr-2">
            Data Inicial:
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            locale={ca}
            className="border border-gray-300 p-2 rounded-md mr-4"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="endDate" className="mr-2">
            Data Final:
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            locale={ca}
            className="border border-gray-300 p-2 rounded-md mr-4"
          />
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          onClick={(e) => searchWorkOrders()}
        >
          Buscar
        </button>
      </div>
      <div className="overflow-x-auto text-black">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Descripció</th>
              <th className="border p-3 text-left">Data Inici</th>
              <th className="border p-3 text-left">Estat</th>
              <th className="border p-3 text-left">Tipus</th>
              <th className="border p-3 text-left">Accions</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {workOrders.map((order, index) => (
              <tr
                key={order.id}
                className={
                  index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                }
              >
                <td className="border p-3">{order.description}</td>
                <td className="border p-3">{formatDate(order.startTime)}</td>
                <td className="border p-3">
                  {translateState(order.stateWorkOrder)}
                </td>
                <td className="border p-3">
                  {translateWorkOrderType(order.workOrderType)}
                </td>
                <td className="border p-3 flex space-x-2 items-center">
                  <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    <Link
                      href="/machineWorkOrders/[id]"
                      as={`/machineWorkOrders/${order.id}`}
                    >
                      Editar
                    </Link>
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
