import { useState } from 'react';
import { EditableCell } from 'app/(pages)/machines/downtimes/components/EditingCell';
import { calculateTotalSecondsBetweenDates } from 'app/(pages)/reports/downtimesReport/component/downtimeUtils';
import { Downtimes } from 'app/interfaces/Production/Downtimes';
import { UserType } from 'app/interfaces/User';
import WorkOrder, { StateWorkOrder } from 'app/interfaces/workOrder';
import WorkOrderService from 'app/services/workOrderService';
import { useSessionStore } from 'app/stores/globalStore';
import {
  calculateTimeDifference,
  formatDate,
  formatTimeSpan,
  translateOperatorType,
  validateFormattedDateTime,
} from 'app/utils/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

interface DowntimesProps {
  downtimes: Downtimes[];
  workOrderId: string;
  currentWorkOrder: WorkOrder;
}

export default function DowntimesComponent({
  downtimes,
  workOrderId,
  currentWorkOrder,
}: DowntimesProps) {
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ''
  );

  const [downtimesWorkorder, setDowntimesWorkorder] =
    useState<Downtimes[]>(downtimes);
  const { loginUser } = useSessionStore();

  const totalTime = downtimesWorkorder.reduce((acc, cur) => {
    return acc + calculateTotalSecondsBetweenDates(cur.startTime, cur.endTime);
  }, 0);

  function totalTimeString(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(Math.floor(seconds)).padStart(2, '0')}`;
  }

  function handleUpdate(
    id: string,
    newValue: string,
    startDate: boolean
  ): void {
    if (!validateFormattedDateTime(newValue)) {
      alert('Format incorrecte, dia/mes/any hores:minuts:segons');

      return;
    }

    const format = 'DD/MM/YYYY HH:mm:ss';
    const dateToSend = dayjs(newValue, format).utc().format(format);

    const newDate = dayjs(newValue, format).utc().format();

    workOrderService.UpdateDowntime({
      startDate: startDate == true ? dateToSend : '',
      endDate: startDate == false ? dateToSend : '',
      workOrderId: workOrderId,
      downtimeId: id,
    });

    setDowntimesWorkorder(prev =>
      prev.map(x =>
        x.id === id
          ? {
              ...x,
              startTime: startDate ? newDate : x.startTime,
              endTime: !startDate ? newDate : x.endTime,
              totalTime: calculateTimeDifference(
                startDate ? newDate : x.startTime,
                !startDate ? newDate : x.endTime
              ),
            }
          : x
      )
    );
  }

  return (
    <div className="p-2 bg-white rounded-lg w-full">
      <div className="flex flex-row items-center py-2 text-lg font-semibold">
        Aturada Producció
      </div>
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="p-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4"
            >
              Inici
            </th>
            <th
              scope="col"
              className="p-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4"
            >
              Fi
            </th>
            <th
              scope="col"
              className="p-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4"
            >
              Temps Total
            </th>
            <th
              scope="col"
              className="p-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/4"
            >
              Operari
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {downtimesWorkorder.map((downtime, index) => (
            <tr key={index}>
              <td className="p-2 whitespace-nowrap w-1/4">
                {currentWorkOrder.stateWorkOrder != StateWorkOrder.Closed &&
                loginUser?.userType == UserType.Production ? (
                  <EditableCell
                    value={formatDate(downtime.startTime)}
                    onUpdate={newValue =>
                      handleUpdate(downtime.id, newValue, true)
                    }
                  />
                ) : (
                  <label>{formatDate(downtime.startTime)}</label>
                )}
              </td>
              <td className="p-2 whitespace-nowrap w-1/4">
                {currentWorkOrder.stateWorkOrder != StateWorkOrder.Closed &&
                loginUser?.userType == UserType.Production ? (
                  <EditableCell
                    value={formatDate(downtime.endTime)}
                    onUpdate={newValue =>
                      handleUpdate(downtime.id, newValue, false)
                    }
                  />
                ) : (
                  <label>{formatDate(downtime.endTime)}</label>
                )}
              </td>
              <td className="p-2 whitespace-nowrap w-1/4">
                {downtime.totalTime
                  ? formatTimeSpan(downtime.totalTime)
                  : 'N/A'}
              </td>
              <td className="p-2 whitespace-nowrap w-1/4">
                {downtime.operator.name} -{' '}
                {translateOperatorType(downtime.operator.operatorType)}
              </td>
            </tr>
          ))}
        </tbody>
        {currentWorkOrder.stateWorkOrder === StateWorkOrder.Closed && (
          <tfoot className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={1}></td>
              <td className=" whitespace-nowrap text-sm text-gray-900 font-bold">
                Temps Total
              </td>
              <td
                colSpan={2}
                className="p-2 whitespace-nowrap text-sm text-gray-900 font-bold"
              >
                {totalTimeString(totalTime)}
              </td>
            </tr>
            {downtimesWorkorder.map((downtime, index) => (
              <tr key={index}>
                <td colSpan={3}></td>
                <td className="p-2 whitespace-nowrap text-sm text-gray-900 font-bold">
                  {downtime.operator.name} -{' '}
                  {totalTimeString(
                    calculateTotalSecondsBetweenDates(
                      downtime.startTime,
                      downtime.endTime
                    )
                  )}
                </td>
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
}
