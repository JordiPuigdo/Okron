"use client";

import React, { useState, useEffect } from "react";
import WorkOrder, {
  SearchWorkOrderFilters,
  StateWorkOrder,
  WorkOrderType,
} from "../../interfaces/workOrder";
import MachineService from "app/services/machineService";
import WorkOrderService from "app/services/workOrderService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import Link from "next/link";
import {
  formatDate,
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import { SvgSpinner } from "app/icons/icons";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import { useRouter } from "next/navigation";
import AutocompleteSearchBar from "components/selector/AutocompleteSearchBar";
import { ElementList } from "components/selector/ElementList";
import DataTable from "components/table/DataTable";
import {
  Column,
  ColumnFormat,
  TableButtons,
} from "components/table/interfaceTable";
import { EntityTable } from "components/table/tableEntitys";

export default function WorkOrdersPage() {
  const [machines, setMachines] = useState<ElementList[] | []>([]);
  const machineService = new MachineService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  const columns: Column[] = [
    {
      label: "ID",
      key: "id",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Codi",
      key: "code",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Descripció",
      key: "description",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Tipus",
      key: "workOrderType",
      format: ColumnFormat.WORKORDERTYPE,
    },
    {
      label: "Data Inici",
      key: "startTime",
      format: ColumnFormat.DATE,
    },
    {
      label: "Estat",
      key: "stateWorkOrder",
      format: ColumnFormat.STATEWORKORDER,
    },
    {
      label: "Equip",
      key: "machine.description",
      format: ColumnFormat.TEXT,
    },
  ];

  const tableButtons: TableButtons = {
    edit: true,
    delete: true,
  };

  const [workOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);
  const [currentMachineId, setCurrentMachineId] = useState<string | "">("");
  const [message, setMessage] = useState<string>("");
  const [selectedStateFilter, setSelectedStateFilter] = useState<
    number | undefined
  >(undefined);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<
    number | undefined
  >(undefined);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loadMachines = async () => {
    try {
      const machinesData = await machineService.getAllMachines();
      const activeMachines = machinesData.filter((machine) => machine.active);
      const mappedMachines = activeMachines.map((machine) => ({
        id: machine.id,
        description: machine.description,
      }));
      setMachines(mappedMachines as ElementList[]);
    } catch (error) {
      console.error("Error fetching machine WorkOrders:", error);
    }
  };

  useEffect(() => {
    loadMachines();
    setIsLoadingPage(false);
  }, []);

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleSearch = async () => {
    setIsLoading(true);
    await searchWorkOrders();
    setIsLoading(false);
  };

  const handleFinalizeWorkOrdersDayBefore = async () => {
    setIsLoading(true);
    const today = new Date();
    await workOrderService.finishWorkOrdersByDate(today);
    await searchWorkOrders();
    setIsLoading(false);
  };

  const searchWorkOrders = async () => {
    const startDateTime = startDate ? new Date(startDate) : null;
    const endDateTime = endDate ? new Date(endDate) : null;
    const machineId = currentMachineId;

    if (startDateTime) {
      startDateTime.setHours(0, 0, 0, 0);
    }

    if (endDateTime) {
      endDateTime.setHours(23, 59, 59, 999);
    }
    const search: SearchWorkOrderFilters = {
      machineId: machineId,
      startDateTime: startDateTime
        ? new Date(
            startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000
          ).toISOString()
        : "",
      endDateTime: endDateTime
        ? new Date(
            endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000
          ).toISOString()
        : "",
    };

    const workOrders = await workOrderService.getWorkOrdersWithFilters(search);
    if (workOrders.length == 0) {
      setMessage("No hi ha ordres disponibles amb aquests filtres");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    setWorkOrders(workOrders);
  };

  const handleDeleteOrder = (orderId: string) => {
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

  const handleStateFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let selectedValue = event.target.value;
    if (!selectedValue) {
      setSelectedStateFilter(undefined);
    } else {
      setSelectedStateFilter(parseInt(selectedValue));
    }
  };

  const handleTypeFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let selectedValue = event.target.value;
    if (!selectedValue) {
      setSelectedTypeFilter(undefined);
    } else {
      setSelectedTypeFilter(parseInt(event.target.value));
    }
  };

  const filteredWorkOrders = workOrders.filter((order) => {
    if (
      selectedStateFilter !== undefined &&
      order.stateWorkOrder !== selectedStateFilter
    ) {
      return false;
    }
    if (
      selectedTypeFilter !== undefined &&
      order.workOrderType !== selectedTypeFilter
    ) {
      return false;
    }
    if (currentMachineId !== "" && order.machineId !== currentMachineId) {
      return false;
    }
    return true;
  });

  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row mb-8">
        <div
          className="cursor-pointer mb-4 sm:mb-0"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 inline-block mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-black mx-auto">
          Històric Ordres de treball
        </h2>
      </div>
    );
  };

  const renderFilterWorkOrders = () => {
    return (
      <div className="bg-white p-2 my-4 rounded-xl gap-4">
        <div className="flex gap-4 my-4 items-center">
          <div className="flex items-center">
            <label htmlFor="startDate" className="mr-2">
              Data inici entre:
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
              i el
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
            type="button"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
            onClick={(e) => handleSearch()}
          >
            Buscar
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
          {message != "" && (
            <span className="text-red-500 ml-4">{message}</span>
          )}
        </div>

        {workOrders.length > 0 && (
          <div className="flex flex-row gap-4 items-center ">
            <AutocompleteSearchBar
              elements={machines}
              setCurrentId={setCurrentMachineId}
              placeholder="Buscar Màquines"
            />
            <span>Estat: </span>
            <select
              id="stateWorkOrder"
              name="stateWorkOrder"
              className="p-3 border border-gray-300 rounded-md w-full "
              value={
                selectedStateFilter !== undefined ? selectedStateFilter : ""
              }
              onChange={handleStateFilterChange}
            >
              <option value="">-</option>
              {Object.values(StateWorkOrder)
                .filter((value) => typeof value === "number")
                .map((state) => (
                  <option
                    key={state}
                    value={
                      typeof state === "string" ? parseInt(state, 10) : state
                    }
                  >
                    {translateStateWorkOrder(state)}
                  </option>
                ))}
            </select>
            <span>Tipus: </span>
            <select
              id="workOrderType"
              name="workOrderType"
              className="p-3 border border-gray-300 rounded-md w-full"
              value={selectedTypeFilter !== undefined ? selectedTypeFilter : ""}
              onChange={handleTypeFilterChange}
            >
              <option value="">-</option>
              {Object.values(WorkOrderType)
                .filter((value) => typeof value === "number")
                .map((state) => (
                  <option
                    key={state}
                    value={
                      typeof state === "string" ? parseInt(state, 10) : state
                    }
                  >
                    {translateWorkOrderType(state)}
                  </option>
                ))}
            </select>
            <span className="text-white rounded-full p-3 w-full text-center bg-okron-corrective font-semibold">
              Correctius:{" "}
              {
                workOrders.filter(
                  (x) => x.workOrderType == WorkOrderType.Corrective
                ).length
              }
            </span>
            <span className="text-white rounded-full p-3 w-full text-center bg-okron-preventive font-semibold">
              Preventius:{" "}
              {
                workOrders.filter(
                  (x) => x.workOrderType == WorkOrderType.Preventive
                ).length
              }
            </span>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingPage) return <MainLayout>Carregant dades...</MainLayout>;

  return (
    <MainLayout>
      <Container>
        {renderHeader()}
        <div>
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
            onClick={(e) => handleFinalizeWorkOrdersDayBefore()}
          >
            Finalitzar les ordres del dia anterior{" "}
            {formatDate(new Date(Date.now() - 86400000), false, false)}
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
        </div>
        {renderFilterWorkOrders()}

        <DataTable
          columns={columns}
          data={filteredWorkOrders}
          tableButtons={tableButtons}
          entity={EntityTable.WORKORDER}
          onDelete={handleDeleteOrder}
        />
      </Container>
    </MainLayout>
  );
}
