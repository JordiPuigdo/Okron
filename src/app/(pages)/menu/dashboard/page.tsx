"use client";
import { UserPermission } from "app/interfaces/User";
import WorkOrder, {
  SearchWorkOrderFilters,
  StateWorkOrder,
  WorkOrderType,
} from "app/interfaces/workOrder";
import OperatorService from "app/services/operatorService";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { BarChartComponent } from "designSystem/BarChart/BarChartComponent";
import { DonutChartComponent } from "designSystem/DonutChart/DonutChartComponent";
import { useEffect, useState } from "react";
import OTsXAsset from "./components/OTsXAsset";
import {
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import { Button } from "designSystem/Button/Buttons";
import { SvgSpinner } from "app/icons/icons";

interface WorkOrdersChartProps {
  operator: string;
  Correctius: number;
  Preventius: number;
}

export interface AssetChartProps {
  asset: string;
  Correctius: number;
  Preventius: number;
  number: number;
}

export interface ConsumedSparePartsChartProps {
  sparePart: string;
  number: number;
}

interface WorkOrderTypeChartProps {
  workOrderType: WorkOrderType;
  value: number;
  index: string;
}

interface WorkOrderStateChartProps {
  statWorkOrder: StateWorkOrder;
  value: number;
  color: string;
}

const Filter = [
  { key: 0, label: "Mensual" },
  { key: 1, label: "Setmanal" },
  { key: 2, label: "Dia" },
];

export default function DashboardPage() {
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

  const validStates = [
    StateWorkOrder.Waiting,
    StateWorkOrder.OnGoing,
    StateWorkOrder.Paused,
    StateWorkOrder.PendingToValidate,
    StateWorkOrder.Finished,
  ];
  const [workOrderState, setWorkOrderState] = useState<
    WorkOrderStateChartProps[]
  >([]);

  const { loginUser } = useSessionStore((state) => state);

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartAssets, setChartAssets] = useState<any[]>([]);
  const [chartConsumedSpareParts, setChartConsumedSpareParts] = useState<any[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const [workOrderTypeChartData, setWorkOrderTypeChartData] = useState<
    WorkOrderTypeChartProps[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<number | null>(0);

  const getFirstDayOfWeek = (currentDate: Date): Date => {
    const currentDayOfWeek = currentDate.getDay();
    const daysToMonday = (currentDayOfWeek === 0 ? -6 : 1) - currentDayOfWeek;
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() + daysToMonday);

    return firstDayOfWeek;
  };

  const firstDayOfWeek = getFirstDayOfWeek(currentDate);

  const stateColors: { [key in StateWorkOrder]: string } = {
    [StateWorkOrder.Waiting]: "border-red-500",
    [StateWorkOrder.OnGoing]: "border-yellow-500",
    [StateWorkOrder.Paused]: "border-gray-300",
    [StateWorkOrder.PendingToValidate]: "border-red-200",
    [StateWorkOrder.Requested]: "border-red-500",
    [StateWorkOrder.Finished]: "border-green-500",
  };

  const handleFilterClick = (filter: number) => {
    if (filter === selectedFilter) return;
    setSelectedFilter(filter);
    switch (filter) {
      case 0:
        fetchData(firstDayOfMonth);
        break;
      case 1:
        fetchData(firstDayOfWeek);
        break;
      case 2:
        fetchData(currentDate);
        break;
    }
  };

  async function fetchData(date: Date) {
    setIsLoading(true);

    const operators = await operatorService.getOperators();

    setChartAssets([]);
    setChartConsumedSpareParts([]);
    setWorkOrderState([]);
    const endDate = new Date(currentDate);

    const filters: SearchWorkOrderFilters = {
      assetId: "",
      operatorId: "",
      startDateTime: date,
      endDateTime: currentDate,
    };
    await workOrderService
      .getWorkOrdersWithFilters(filters)
      .then((response) => {
        getTopAssets(response);

        getTopConsumedSpareParts(response);

        if (!operators) return;

        const updatedWorkOrderTypes = validStates.map((state) => ({
          statWorkOrder: state,
          value: 0,
          color: stateColors[state],
        }));

        const operatorMap = new Map<string, WorkOrdersChartProps>();
        const workOrderTypeMap = new Map<
          WorkOrderType,
          WorkOrderTypeChartProps
        >();

        response.forEach((workOrder) => {
          const index = validStates.findIndex(
            (state) => state === workOrder.stateWorkOrder
          );
          if (index !== -1) {
            updatedWorkOrderTypes[index].value++;
          }

          const workOrderType = workOrder.workOrderType;
          if (workOrderTypeMap.has(workOrderType)) {
            workOrderTypeMap.get(workOrderType)!.value++;
          } else {
            const workOrderTypeChartProps: WorkOrderTypeChartProps = {
              workOrderType: workOrderType,
              value: 0,
              index: translateWorkOrderType(workOrderType),
            };
            workOrderTypeMap.set(workOrderType, workOrderTypeChartProps);
          }

          const operatorId = workOrder.operatorId?.map((op) => op) || [];

          operatorId.forEach((operatorName) => {
            const existingOperator = operatorMap.get(operatorName);

            if (existingOperator) {
              if (workOrder.workOrderType === WorkOrderType.Preventive) {
                existingOperator.Preventius++;
              } else if (workOrder.workOrderType === WorkOrderType.Corrective) {
                existingOperator.Correctius++;
              }
            } else {
              const newOperatorEntry: WorkOrdersChartProps = {
                operator:
                  operators.find((x) => x.id === operatorName)?.name ||
                  "Proves",
                Preventius:
                  workOrder.workOrderType === WorkOrderType.Preventive ? 1 : 0,
                Correctius:
                  workOrder.workOrderType === WorkOrderType.Corrective ? 1 : 0,
              };
              operatorMap.set(operatorName, newOperatorEntry);
            }
          });
        });
        setWorkOrderState(updatedWorkOrderTypes);
        const workOrderTypeChartData = Array.from(workOrderTypeMap.values());
        setWorkOrderTypeChartData(workOrderTypeChartData);
        debugger;
        const data = Array.from(operatorMap.values());
        setChartData(data);
      });
    setIsLoading(false);
  }

  useEffect(() => {
    if (loginUser?.permission == UserPermission.Administrator) {
      fetchData(firstDayOfMonth);
      const initialWorkOrderTypes = validStates.map((state) => ({
        statWorkOrder: state,
        value: 0,
        color: stateColors[state],
      }));
      setWorkOrderState(initialWorkOrderTypes);
    }
  }, []);

  function getTopAssets(workOrders: WorkOrder[], top: number = 3) {
    const assetMap = new Map<string, AssetChartProps>();

    workOrders.forEach((workOrder) => {
      const asset = workOrder.asset?.description;
      if (asset) {
        const existingAsset = assetMap.get(asset);
        if (existingAsset) {
          if (workOrder.workOrderType === WorkOrderType.Preventive) {
            existingAsset.Preventius++;
          }
          if (workOrder.workOrderType === WorkOrderType.Corrective) {
            existingAsset.Correctius++;
          }
          existingAsset.number++;
        } else {
          const newAssetEntry: AssetChartProps = {
            asset: asset,
            number: 1,
            Preventius:
              workOrder.workOrderType === WorkOrderType.Preventive ? 1 : 0,
            Correctius:
              workOrder.workOrderType === WorkOrderType.Corrective ? 1 : 0,
          };
          assetMap.set(asset, newAssetEntry);
        }
      }
    });
    const sortedAssets = Array.from(assetMap.values()).sort(
      (a, b) => b.number - a.number
    );

    setChartAssets(sortedAssets.slice(0, top));
  }

  function getTopConsumedSpareParts(workOrders: WorkOrder[], top: number = 3) {
    const consumedSparePartsMap = new Map<
      string,
      ConsumedSparePartsChartProps
    >();

    workOrders.forEach((workOrder) => {
      const consumedSpareParts = workOrder.workOrderSpareParts?.map(
        (sparePart) => sparePart
      );

      if (consumedSpareParts) {
        consumedSpareParts.forEach((consumedSparePart) => {
          const existingConsumedSparePart = consumedSparePartsMap.get(
            consumedSparePart.sparePart.code
          );
          if (existingConsumedSparePart) {
            existingConsumedSparePart.number += consumedSparePart.quantity;
          } else {
            const newConsumedSparePartEntry: ConsumedSparePartsChartProps = {
              sparePart: consumedSparePart.sparePart.code,
              number: consumedSparePart.quantity,
            };
            consumedSparePartsMap.set(
              consumedSparePart.sparePart.code,
              newConsumedSparePartEntry
            );
          }
        });
      }

      const sortedSpareParts = Array.from(consumedSparePartsMap.values()).sort(
        (a, b) => b.number - a.number
      );
      setChartConsumedSpareParts(sortedSpareParts.slice(0, top));
    });
  }

  if (isLoading) return <SvgSpinner className="w-full text-white" />;

  if (loginUser?.permission !== UserPermission.Administrator) return <></>;
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-col gap-4 w-full items-center p-2 rounded-xl">
        <div className="flex justify-start w-full gap-2 py-4">
          {Filter.map((filter) => (
            <Button
              key={filter.key}
              type="none"
              className={`rounded-md text-white ${
                filter.key === selectedFilter
                  ? "bg-gray-200 hover:cursor-default"
                  : "bg-gray-500 hover:bg-gray-600 "
              }`}
              customStyles="flex text-center"
              onClick={() => handleFilterClick(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-4 text-white w-full ">
          {workOrderState.map((workOrderType) => (
            <div
              key={workOrderType.statWorkOrder}
              className={`flex flex-col justify-center gap-4 p-4 bg-gray-900 w-full border-t-4 ${workOrderType.color}`}
            >
              <div className="flex w-full items-center justify-center">
                <p className="text-lg font-semibold text-white">
                  {translateStateWorkOrder(workOrderType.statWorkOrder)}
                </p>
              </div>
              <div className="flex w-full items-center justify-around">
                <p className="text-lg font-semibold text-white">
                  {workOrderType.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-4 rounded-xl p-2 bg-white border-2 border-blue-950">
        <DonutChartComponent
          chartData={workOrderTypeChartData}
          category={["Preventius", "Correctius"]}
          index="index"
          title="Correctius vs Preventius"
        />
        {chartData.length > 0 && (
          <BarChartComponent
            category={["Preventius", "Correctius"]}
            chartData={chartData}
            index="operator"
          />
        )}
      </div>
      {chartAssets.length > 0 && (
        <div className="flex flex-row w-full  justify-center gap-4">
          <div className=" border-2 border-blue-950 bg-white p-4 rounded-xl w-full">
            <OTsXAsset chartAssets={chartAssets} />
          </div>
          <div className=" border-2 border-blue-950 bg-white p-4 rounded-xl w-full">
            <p className="text-lg font-semibold mb-4 items-center w-full">
              Top Recanvis mes consumits
            </p>
            <ul className="grid grid-rows-3 gap-4 w-full">
              {chartConsumedSpareParts.map((consumedSparePart, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-4 rounded-md shadow-md flex justify-between items-center gap-4"
                >
                  <div>
                    <span className="text-lg font-semibold">
                      {consumedSparePart.sparePart}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Total consums: {consumedSparePart.number}
                    </span>
                  </div>
                  {index === 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      1r
                    </span>
                  )}
                  {index === 1 && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      2n
                    </span>
                  )}
                  {index === 2 && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      3r
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
