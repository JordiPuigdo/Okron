"use client";

import WorkOrder, { WorkOrderType } from "app/interfaces/workOrder";
import { translateWorkOrderType } from "app/utils/utils";
import dayjs from "dayjs";

interface WorkOrdersDashboardProps {
  workOrders: WorkOrder[];
}

const WorkOrdersDashboard: React.FC<WorkOrdersDashboardProps> = ({
  workOrders,
}) => {
  const calculateTotalTime = (workOrder: WorkOrder) => {
    let totalTime = 0;

    workOrder.workOrderOperatorTimes?.forEach((time) => {
      const startTime = new Date(time.startTime).getTime();
      const endTime = time.endTime ? new Date(time.endTime).getTime() : null;

      if (endTime && startTime < endTime) {
        const timeDifference = endTime - startTime;
        totalTime += timeDifference;
      }
    });

    return totalTime / (1000 * 60);
  };

  const calculateTotalCost = (workOrder: WorkOrder) => {
    let totalCost = 0;

    workOrder.workOrderSpareParts?.forEach((sparePart) => {
      totalCost += sparePart.quantity * 23.4;
      //sparePart.sparePart.price;
    });

    return totalCost;
  };

  const groupedWorkOrders = workOrders.reduce((acc, workOrder) => {
    const dayKey = dayjs(workOrder.startTime).format("DD/MM/YYYY");
    const typeKey = workOrder.workOrderType;
    const totalTime = calculateTotalTime(workOrder);
    const totalCost = calculateTotalCost(workOrder);

    if (!acc[dayKey]) {
      acc[dayKey] = {};
    }

    if (!acc[dayKey][typeKey]) {
      acc[dayKey][typeKey] = { count: 0, totalTime: 0, totalCost: 0 };
    }

    acc[dayKey][typeKey].count += 1;
    acc[dayKey][typeKey].totalTime += totalTime;
    acc[dayKey][typeKey].totalCost += totalCost;

    return acc;
  }, {} as Record<string, Record<string, { count: number; totalTime: number; totalCost: number }>>);

  return (
    <div className="flex flex-col bg-white gap-4 w-full items-center p-2 rounded-xl">
      <div className="w-full max-h-64 overflow-y-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-left">
              <th className="p-2">Dia</th>
              <th className="p-2">Tipus</th>
              <th className="p-2">Total OTs</th>
              <th className="p-2">Minuts totals</th>
              <th className="p-2 text-right">Cost Material</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedWorkOrders).map(([day, types]) =>
              Object.entries(types).map(([type, data]) => (
                <tr key={`${day}-${type}`} className="border-b">
                  <td className="p-2 whitespace-nowrap">{day}</td>
                  <td className="p-2">
                    {translateWorkOrderType(type as unknown as WorkOrderType)}
                  </td>
                  <td className="p-2">{data.count}</td>
                  <td className="p-2">{Math.round(data.totalTime)}</td>
                  <td className="p-2 text-right whitespace-nowrap">
                    {Math.round(data.totalCost)} €
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkOrdersDashboard;
