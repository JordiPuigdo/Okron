"use client";
import { UserPermission } from "app/interfaces/User";
import WorkOrder, {
  SearchWorkOrderFilters,
  WorkOrderType,
} from "app/interfaces/workOrder";
import OperatorService from "app/services/operatorService";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { BarChartComponent } from "designSystem/BarChart/BarChartComponent";
import { DonutChartComponent } from "designSystem/DonutChart/DonutChartComponent";
import { useEffect, useState } from "react";
import OTsXAsset from "./components/OTsXAsset";

interface WorkOrdersChartProps {
  operator: string;
  numberPreventive: number;
  numberCorrective: number;
}

export interface AssetChartProps {
  asset: string;
  numberPreventive: number;
  numberCorrective: number;
  number: number;
}

export interface ConsumedSparePartsChartProps {
  sparePart: string;
  number: number;
}

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
    currentDate.getMonth(),
    1
  );

  const { loginUser } = useSessionStore((state) => state);

  const [chartData, setChartData] = useState<any[]>([]);
  const [chartAssets, setChartAssets] = useState<any[]>([]);
  const [chartConsumedSpareParts, setChartConsumedSpareParts] = useState<any[]>(
    []
  );

  useEffect(() => {
    async function fetchData() {
      const operators = await operatorService.getOperators();

      const filters: SearchWorkOrderFilters = {
        assetId: "",
        operatorId: "",
        startDateTime: firstDayOfMonth.toISOString(),
        endDateTime: currentDate.toISOString(),
      };
      await workOrderService
        .getWorkOrdersWithFilters(filters)
        .then((response) => {
          getTopAssets(response);

          getTopConsumedSpareParts(response);

          if (!operators) return;
          const operatorMap = new Map<string, WorkOrdersChartProps>();

          response.forEach((workOrder) => {
            const operatorId = workOrder.operatorId?.map((op) => op) || [];

            operatorId.forEach((operatorName) => {
              const existingOperator = operatorMap.get(operatorName);

              if (existingOperator) {
                if (workOrder.workOrderType === WorkOrderType.Preventive) {
                  existingOperator.numberPreventive++;
                } else if (
                  workOrder.workOrderType === WorkOrderType.Corrective
                ) {
                  existingOperator.numberCorrective++;
                }
              } else {
                const newOperatorEntry: WorkOrdersChartProps = {
                  operator:
                    operators.find((x) => x.id === operatorName)?.name ||
                    "Proves",
                  numberPreventive:
                    workOrder.workOrderType === WorkOrderType.Preventive
                      ? 1
                      : 0,
                  numberCorrective:
                    workOrder.workOrderType === WorkOrderType.Corrective
                      ? 1
                      : 0,
                };
                operatorMap.set(operatorName, newOperatorEntry);
              }
            });
          });

          const data = Array.from(operatorMap.values());
          setChartData(data);
        });
    }
    if (loginUser?.permission == UserPermission.Administrator) fetchData();
  }, []);

  function getTopAssets(workOrders: WorkOrder[], top: number = 5) {
    const assetMap = new Map<string, AssetChartProps>();

    workOrders.forEach((workOrder) => {
      const asset = workOrder.asset?.description;
      if (asset) {
        const existingAsset = assetMap.get(asset);
        if (existingAsset) {
          if (workOrder.workOrderType === WorkOrderType.Preventive) {
            existingAsset.numberPreventive++;
          }
          if (workOrder.workOrderType === WorkOrderType.Corrective) {
            existingAsset.numberCorrective++;
          }
          existingAsset.number++;
        } else {
          const newAssetEntry: AssetChartProps = {
            asset: asset,
            number: 1,
            numberPreventive:
              workOrder.workOrderType === WorkOrderType.Preventive ? 1 : 0,
            numberCorrective:
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

  if (loginUser?.permission !== UserPermission.Administrator) return <></>;
  return (
    <>
      <div className="flex flex-col gap-12 w-full items-center bg-white p-4 rounded-xl">
        {chartData.length > 0 && (
          <BarChartComponent
            category={["numberPreventive", "numberCorrective"]}
            chartData={chartData}
            index="operator"
          />
        )}
        {chartAssets.length > 0 && (
          <div className="flex flex-row gap-11">
            <div>
              <OTsXAsset chartAssets={chartAssets} />
            </div>
            <div>
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
    </>
  );
}
