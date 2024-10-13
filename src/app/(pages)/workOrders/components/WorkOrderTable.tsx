"use client";

import WorkOrder, {
  SearchWorkOrderFilters,
  StateWorkOrder,
  UpdateStateWorkOrder,
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
import { OperatorType } from "app/interfaces/Operator";
import { Button } from "designSystem/Button/Buttons";
import { FilterWorkOrders } from "app/types/filterWorkOrders";

interface WorkOrderTableProps {
  enableFilterAssets?: boolean;
  enableFilters: boolean;
  enableDetail?: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  assetId?: string | "";
  enableFinalizeWorkOrdersDayBefore?: boolean;
  operatorId?: string | "";
  workOrderType?: WorkOrderType;
  refresh?: boolean;
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
    format: ColumnFormat.DATETIME,
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

interface ResponseMessage {
  message: string;
  isSuccess: boolean;
}

const WorkOrderTable: React.FC<WorkOrderTableProps> = ({
  enableFilterAssets = false,
  enableFilters = false,
  enableDetail = false,
  enableEdit,
  enableDelete,
  assetId,
  enableFinalizeWorkOrdersDayBefore = false,
  operatorId,
  workOrderType,
  refresh,
}) => {
  const { operatorLogged, loginUser, setFilterWorkOrders, filterWorkOrders } =
    useSessionStore((state) => state);
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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  const tableButtons: TableButtons = {
    edit: enableEdit,
    delete: enableDelete,
    detail: enableDetail,
  };

  const [responseMessage, setResponseMessage] =
    useState<ResponseMessage | null>(null);

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assetId!);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assets = await assetService.getAll();
        const elements: ElementList[] = [];

        const addAssetAndChildren = (asset: Asset) => {
          if (asset.createWorkOrder) {
            elements.push({
              id: asset.id,
              description: asset.description,
            });
          }

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

    const fetchWorkOrders = async () => {
      setIsLoading(true);
      await searchWorkOrders();
      setIsLoading(false);
    };

    if (assetId == undefined) fetchAssets();
    if (operatorId !== undefined) handleSearch();

    fetchWorkOrders();
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (refresh) {
      setSelectedTypeFilter(workOrderType);
    }
  }, [refresh, workOrderType]);

  function isValidDate(d: any): boolean {
    return d instanceof Date && !isNaN(d.getTime());
  }

  function getStartDateTime() {
    if (filterWorkOrders?.startDateTime !== undefined) {
      if (firstLoad) {
        setStartDate(new Date(filterWorkOrders.startDateTime));
        return new Date(filterWorkOrders.startDateTime);
      } else {
        return startDate;
      }
    }
    return startDate;
  }

  function getEndDateTime() {
    if (filterWorkOrders?.endDateTime !== undefined) {
      if (firstLoad) {
        setEndDate(new Date(filterWorkOrders.endDateTime));
        return new Date(filterWorkOrders.endDateTime);
      } else {
        return endDate;
      }
    }
    return endDate;
  }

  const searchWorkOrders = async () => {
    let search: SearchWorkOrderFilters;
    try {
      search = {
        assetId: "",
        operatorId: operatorId || "",
        startDateTime: getStartDateTime()!,
        endDateTime: getEndDateTime()!,
      };
    } catch (error) {
      console.error("Error fetching work orders:", error);
      return;
    }

    if (operatorLogged?.operatorLoggedType == OperatorType.Quality) {
      search.stateWorkOrder = StateWorkOrder.PendingToValidate;
      search.startDateTime = undefined;
      search.endDateTime = undefined;
    }
    const filters: FilterWorkOrders = {
      startDateTime: startDate!,
      endDateTime: endDate!,
    };
    setFilterWorkOrders(filters);
    const workOrders = await workOrderService.getWorkOrdersWithFilters(search);
    if (workOrders.length == 0 && !firstLoad) {
      setMessage("No hi ha ordres disponibles amb aquests filtres");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    try {
      setWorkOrders(
        workOrders.sort((a, b) => {
          const startTimeA = new Date(a.startTime).valueOf();
          const startTimeB = new Date(b.startTime).valueOf();
          return startTimeA - startTimeB;
        })
      );
    } catch (error) {
      console.error("Error fetching work orders:", error);
    }
  };
  const handleDateChange = (
    date: Date | null,
    setDate: (value: Date | null) => void
  ) => {
    debugger;
    if (date instanceof Date && !isNaN(date.valueOf())) {
      setDate(date);
    } else {
      console.error("Invalid date selected:", date);
      setDate(null);
    }
  };
  const renderFilterWorkOrders = () => {
    return (
      <div className="bg-white  rounded-xl gap-4 p-2 shadow-md">
        <div className="flex gap-4 my-4 items-center">
          {!isLoading && (
            <>
              <div className="flex items-center">
                <label htmlFor="startDate" className="mr-2">
                  Inici
                </label>
                <DatePicker
                  id="startDate"
                  selected={startDate ?? new Date()}
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
                  selected={endDate ?? new Date()}
                  onChange={(date: Date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={ca}
                  className="border border-gray-300 p-2 rounded-md mr-4"
                />
              </div>
            </>
          )}

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
                .filter((value) => typeof value === "number" && value !== 4)
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
            <span
              className="text-white rounded-full p-3 w-full text-center bg-okron-corrective font-semibold hover:cursor-pointer"
              onClick={() => {
                if (selectedTypeFilter == WorkOrderType.Corrective) {
                  setSelectedTypeFilter(undefined);
                  return;
                }
                setSelectedTypeFilter(WorkOrderType.Corrective);
              }}
            >
              Correctius:{" "}
              {
                filteredWorkOrders.filter(
                  (x) => x.workOrderType == WorkOrderType.Corrective
                ).length
              }
            </span>
            <span
              className="text-white rounded-full p-3 w-full text-center bg-okron-preventive font-semibold hover:cursor-pointer"
              onClick={() => {
                if (selectedTypeFilter == WorkOrderType.Preventive) {
                  setSelectedTypeFilter(undefined);
                  return;
                }
                setSelectedTypeFilter(WorkOrderType.Preventive);
              }}
            >
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

  const handleOnChecked = (id?: string) => {
    if (id != undefined) {
      setSelectedRows((prevSelectedRows) => {
        const newSelectedRows = new Set(prevSelectedRows);
        if (newSelectedRows.has(id)) {
          newSelectedRows.delete(id);
        } else {
          newSelectedRows.add(id);
        }
        return newSelectedRows;
      });
    } else {
      if (selectedRows.size === filteredWorkOrders.length) {
        setSelectedRows(new Set());
      } else {
        setSelectedRows(new Set(filteredWorkOrders.map((row) => row.id)));
      }
    }
  };

  const handleFinalizeWorkOrders = async () => {
    if (isUpdating || selectedRows.size == 0) return;

    setIsUpdating(true);

    const workOrders = Array.from(selectedRows).map((workOrderId) => ({
      workOrderId,
      state: StateWorkOrder.Finished,
      operatorId: operatorLogged?.idOperatorLogged,
      userId: loginUser?.agentId,
    }));

    await workOrderService
      .updateStateWorkOrder(workOrders)
      .then((response) => {
        if (response) {
          setResponseMessage({
            message: "Ordres actualitzades correctament",
            isSuccess: true,
          });
          setTimeout(() => {
            setResponseMessage({
              message: "",
              isSuccess: true,
            });
          }, 2000);

          searchWorkOrders();
        } else {
          setTimeout(() => {
            setResponseMessage({
              message: "Error actualitzant ordres",
              isSuccess: false,
            });
          }, 3000);
        }
      })
      .catch((error) => {
        setTimeout(() => {
          setResponseMessage({
            message: error,
            isSuccess: false,
          });
        }, 3000);
      });
    setSelectedRows(new Set());
    setIsUpdating(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {enableFilters && !isLoading && renderFilterWorkOrders()}
        <DataTable
          columns={columns}
          data={filteredWorkOrders}
          tableButtons={tableButtons}
          entity={EntityTable.WORKORDER}
          onDelete={handleDeleteOrder}
          enableFilterActive={false}
          enableCheckbox={
            operatorLogged?.operatorLoggedType == OperatorType.Quality
          }
          onChecked={handleOnChecked}
        />
      </div>
      {filteredWorkOrders.length > 0 &&
        operatorLogged?.operatorLoggedType == OperatorType.Quality && (
          <div className="py-4 flex flex-row gap-2">
            <Button
              type="none"
              className={`text-white ${
                selectedRows.size > 0 || !isUpdating
                  ? " bg-blue-900 hover:bg-blue-950 "
                  : " bg-gray-200 hover:cursor-not-allowed "
              }  rounded-lg text-sm `}
              size="lg"
              customStyles="align-middle flex"
              onClick={async () => {
                await handleFinalizeWorkOrders();
              }}
            >
              {isUpdating ? (
                <SvgSpinner className="text-white" />
              ) : (
                <>Finalitzar</>
              )}
            </Button>
            {responseMessage && (
              <div
                className={` ${
                  responseMessage ? "text-green-500" : "text-red-500"
                } text-center font-semibold p-2 items-center flex justify-center`}
              >
                {responseMessage.message}
              </div>
            )}
          </div>
        )}
    </>
  );
};

export default WorkOrderTable;
