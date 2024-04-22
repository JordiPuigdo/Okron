"use client";

import WorkOrder, {
  SearchWorkOrderFilters,
  StateWorkOrder,
  WorkOrderType,
} from "app/interfaces/workOrder";
import WorkOrderService from "app/services/workOrderService";
import {
  formatDate,
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import DataTable from "components/table/DataTable";
import {
  Column,
  ColumnFormat,
  TableButtons,
} from "components/table/interfaceTable";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import { SvgSpinner } from "app/icons/icons";
import AutocompleteSearchBar from "components/selector/AutocompleteSearchBar";
import { EntityTable } from "components/table/tableEntitys";
import { Asset } from "app/interfaces/Asset";
import AssetService from "app/services/assetService";
import { ElementList } from "components/selector/ElementList";
import FinalizeWorkOrdersDaysBefore from "./FinalizeWorkOrdersDaysBefore";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";

interface WorkOrderTableProps {
  enableFilterAssets?: boolean;
  enableFilters: boolean;
  enableDetail?: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  assetId?: string | "";
  enableFinalizeWorkOrdersDayBefore?: boolean;
  operatorId?: string | "";
}

const columns: Column[] = [
  {
    label: "ID",
    key: "id",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Num Sèrie",
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
    key: "asset.description",
    format: ColumnFormat.TEXT,
  },
];

const WorkOrderTable: React.FC<WorkOrderTableProps> = ({
  enableFilterAssets = false,
  enableFilters = false,
  enableDetail = false,
  enableEdit,
  enableDelete,
  assetId,
  enableFinalizeWorkOrdersDayBefore = false,
  operatorId,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [workOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);
  const [assets, setAssets] = useState<ElementList[]>([]);
  const [selectedStateFilter, setSelectedStateFilter] = useState<
    number | undefined
  >(undefined);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<
    number | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const assetService = new AssetService(process.env.NEXT_PUBLIC_API_BASE_URL!);

  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  const tableButtons: TableButtons = {
    edit: enableEdit,
    delete: enableDelete,
    detail: enableDetail,
  };

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assetId!);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assets = await assetService.getAll();
        const elements: ElementList[] = [];

        const addAssetAndChildren = (asset: Asset) => {
          elements.push({
            id: asset.id,
            description: asset.description,
          });

          asset.childs.forEach((childAsset) => {
            addAssetAndChildren(childAsset);
          });
        };

        assets.forEach((asset) => {
          addAssetAndChildren(asset);
        });
        setAssets(elements);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    if (assetId == undefined) fetchAssets();
    if (operatorId !== undefined) handleSearch();
  }, []);

  const searchWorkOrders = async () => {
    const startDateTime = startDate ? new Date(startDate) : null;
    const endDateTime = endDate ? new Date(endDate) : null;
    const machineId = 0;

    if (startDateTime) {
      startDateTime.setHours(0, 0, 0, 0);
    }
    if (endDateTime) {
      endDateTime.setHours(23, 59, 59, 999);
    }
    const search: SearchWorkOrderFilters = {
      assetId: "",
      operatorId: operatorId || "",
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
    setWorkOrders(
      workOrders.sort((a, b) => {
        const startTimeA = new Date(a.startTime).valueOf();
        const startTimeB = new Date(b.startTime).valueOf();
        return startTimeA - startTimeB;
      })
    );
  };

  const renderFilterWorkOrders = () => {
    return (
      <div className="bg-white p-2 my-4 rounded-xl gap-4">
        <div className="flex gap-4 my-4 items-center">
          <div className="flex items-center">
            <label htmlFor="startDate" className="mr-2">
              Inici:
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
              Final
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
          {enableFinalizeWorkOrdersDayBefore && (
            <FinalizeWorkOrdersDaysBefore
              onFinalizeWorkOrdersDayBefore={searchWorkOrders}
            />
          )}
          {message != "" && (
            <span className="text-red-500 ml-4">{message}</span>
          )}
        </div>

        {workOrders.length > 0 && (
          <div className="flex flex-row gap-4 items-center ">
            {enableFilterAssets && (
              <AutocompleteSearchBar
                elements={assets}
                setCurrentId={setSelectedAssetId}
                placeholder="Buscar Equips"
              />
            )}
            <input
              type="text"
              placeholder="Codi / Descripció"
              className="p-3 border border-gray-300 rounded-md w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
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
                filteredWorkOrders.filter(
                  (x) => x.workOrderType == WorkOrderType.Corrective
                ).length
              }
            </span>
            <span className="text-white rounded-full p-3 w-full text-center bg-okron-preventive font-semibold">
              Preventius:{" "}
              {
                filteredWorkOrders.filter(
                  (x) => x.workOrderType == WorkOrderType.Preventive
                ).length
              }
            </span>
          </div>
        )}
      </div>
    );
  };

  const handleSearch = async () => {
    setIsLoading(true);

    await searchWorkOrders();
    setIsLoading(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    const isConfirmed = window.confirm(
      `Esteu segurs que voleu eliminar l'ordre de treball?`
    );

    if (isConfirmed) {
      workOrderService.deleteWorkOrder(orderId);
      setWorkOrders((prevWorkOrders) =>
        prevWorkOrders
          .filter((prevWorkOrders) => prevWorkOrders.id !== orderId)
          .sort((a, b) => {
            const startTimeA = new Date(a.startTime).valueOf();
            const startTimeB = new Date(b.startTime).valueOf();
            return startTimeA - startTimeB;
          })
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
    if (
      searchTerm.length > 0 &&
      !order.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (
      selectedAssetId != undefined &&
      selectedAssetId.length > 0 &&
      order.asset?.id !== selectedAssetId
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      {enableFilters && renderFilterWorkOrders()}
      <DataTable
        columns={columns}
        data={filteredWorkOrders}
        tableButtons={tableButtons}
        entity={EntityTable.WORKORDER}
        onDelete={handleDeleteOrder}
        enableFilterActive={false}
      />
    </>
  );
};

export default WorkOrderTable;
