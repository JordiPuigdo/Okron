"use client";
import { UserPermission } from "app/interfaces/User";
import {
  SearchWorkOrderFilters,
  WorkOrderType,
} from "app/interfaces/workOrder";
import OperatorService from "app/services/operatorService";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { BarChartComponent } from "designSystem/BarChart/BarChartComponent";
import { DonutChartComponent } from "designSystem/DonutChart/DonutChartComponent";
import { useEffect, useState } from "react";

interface WorkOrdersChartProps {
  operator: string;
  numberPreventive: number;
  numberCorrective: number;
}

export default function DasboardPage() {
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
  if (loginUser?.permission !== UserPermission.Administrator) return <></>;
  return (
    <>
      <div className="flex flex-row gap-12 w-full items-center bg-white p-4 rounded-xl">
        {chartData.length > 0 && (
          <BarChartComponent
            category={["numberPreventive", "numberCorrective"]}
            chartData={chartData}
            index="operator"
          />
        )}
      </div>
    </>
  );
}
