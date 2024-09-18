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

  const groupedWorkOrders = workOrders.reduce((acc, workOrder) => {
    const dayKey = dayjs(workOrder.startTime).format("DD/MM/YYYY");
    const typeKey = workOrder.workOrderType;
    const totalTime = calculateTotalTime(workOrder);

    if (!acc[dayKey]) {
      acc[dayKey] = {};
    }

    if (!acc[dayKey][typeKey]) {
      acc[dayKey][typeKey] = { count: 0, totalTime: 0 };
    }

    acc[dayKey][typeKey].count += 1;
    acc[dayKey][typeKey].totalTime += totalTime;

    return acc;
  }, {} as Record<string, Record<string, { count: number; totalTime: number }>>);

  return (
    <div className="flex flex-col bg-white gap-4 w-full items-center p-4 rounded-xl max-h-64 overflow-y-scroll">
      <table className="table-auto w-full">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2">Dia</th>
            <th className="p-2">Tipus</th>
            <th className="p-2">Quantitat</th>
            <th className="p-2">Minuts totals</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedWorkOrders).map(([day, types]) =>
            Object.entries(types).map(([type, data]) => (
              <tr key={`${day}-${type}`} className="border-b">
                <td className="p-2">{day}</td>
                <td className="p-2">
                  {translateWorkOrderType(type as unknown as WorkOrderType)}
                </td>
                <td className="p-2">{data.count}</td>
                <td className="p-2">{Math.round(data.totalTime)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkOrdersDashboard;
