import React from 'react';
import {
  DowntimesReasonsType,
  OriginDowntime,
} from 'app/interfaces/Production/Downtimes';
import {
  DowntimesTicketReportList,
  DowntimesTicketReportModel,
} from 'app/interfaces/Production/DowntimesTicketReport';
import {
  calculateTimeDifference,
  formatDate,
  translateDowntimeReasonType,
} from 'app/utils/utils';
import Link from 'next/link';

import {
  calculateTotalDowntimeMWO,
  calculateTotalDowntimesWorkOrder,
} from './downtimeUtils';

interface WorkOrderCardProps {
  workOrder: DowntimesTicketReportList;
  expandedTargetId: string | null;
  from: Date;
  to: Date;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  workOrder,
  expandedTargetId,
  from,
  to,
}) => {
  return (
    <div
      id={`workorder-${workOrder.workOrderId}`}
      className={`bg-gray-100 rounded-lg p-3 shadow-inner
       ${
         workOrder.workOrderId === expandedTargetId
           ? 'border-4 border-blue-400'
           : ''
       }`}
    >
      <Link
        href={`/workOrders/${workOrder.workOrderId}?id=${workOrder.workOrderId}&entity=DowntimesReport&from=${from}&to=${to}`}
      >
        <div className="flex flex-row gap-2 w-full items-center text-lg font-medium text-gray-800 mb-2 bg-gray-300 p-2 rounded-lg hover:bg-gray-400">
          <span className="flex-1">{workOrder.workOrderCode}</span>
          <span className="flex-1">{workOrder.workOrderDescription}</span>
          <span className="flex-1">{workOrder.downtimeReason}</span>
          <span className="flex-1 text-right">
            {calculateTotalDowntimeMWO(workOrder.downtimesWorkOrder)}
          </span>
        </div>
      </Link>
      {RenderWorkOrderDetail(workOrder)}
      <div className="flex w-full gap-2">
        <div className="w-full p-2 justify-end bg-white rounded-lg font-semibold">
          {calculateTotalDowntimesWorkOrder(
            workOrder,
            OriginDowntime.Production
          )}
        </div>
        <div className="w-full p-2 justify-end font-semibold bg-white rounded-lg">
          {calculateTotalDowntimesWorkOrder(
            workOrder,
            OriginDowntime.Maintenance
          )}
        </div>
      </div>
    </div>
  );
};

function RenderWorkOrderDetail(workOrder: DowntimesTicketReportList) {
  return (
    <div className="flex w-full">
      <div className={`flex flex-row w-full gap-2`}>
        <div className="w-full">
          {MapDowntimes(
            workOrder.downtimesWorkOrder.filter(
              x => x.originDownTime === OriginDowntime.Production
            )
          )}
        </div>
        <div className="w-full">
          {MapDowntimes(
            workOrder.downtimesWorkOrder.filter(
              x => x.originDownTime !== OriginDowntime.Production
            )
          )}
        </div>
      </div>
    </div>
  );
}

function MapDowntimes(downtimes: DowntimesTicketReportModel[]) {
  return (
    <>
      {downtimes.map((downtime, downtimeIndex) => (
        <div
          key={downtimeIndex}
          className={`flex flex-row my-2 text-sm p-2 rounded shadow-sm gap-2 ${
            downtime.originDownTime === OriginDowntime.Production
              ? 'bg-red-700'
              : 'bg-blue-700'
          }`}
        >
          <div className="w-full flex flex-col border-r-2 gap-2">
            <div className="w-full flex gap-1 ">
              <span className="text-white font-bold">Inici:</span>
              <span className="text-white">
                {formatDate(downtime.startTime)}
              </span>
              <span className="text-white font-bold">Final:</span>
              <span className="text-white">{formatDate(downtime.endTime)}</span>
            </div>

            <div className="flex items-start gap-1">
              <span className="text-white font-semibold">Total:</span>
              <span className="text-white">
                {calculateTimeDifference(downtime.startTime, downtime.endTime)}
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex flex-col gap-2 items-end">
              <span className="text-white font-semibold">
                {translateDowntimeReasonType(
                  downtime.originDownTime as unknown as DowntimesReasonsType
                )}
              </span>
              <div className="flex flex-wrap">
                <span className="text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[87px]">
                  {downtime.operator.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default WorkOrderCard;
