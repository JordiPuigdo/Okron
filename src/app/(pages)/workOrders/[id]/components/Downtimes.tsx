import { EditableCell } from 'app/(pages)/machines/downtimes/components/EditingCell';
import { Downtimes } from 'app/interfaces/Production/Downtimes';
import WorkOrderService from 'app/services/workOrderService';
import {
  calculateTimeDifference,
  formatDate,
  formatTimeSpan,
  isValidDateTimeFormat,
  translateOperatorType,
  validateFormattedDateTime,
} from 'app/utils/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useSessionStore } from 'app/stores/globalStore';
import WorkOrder, { StateWorkOrder } from 'app/interfaces/workOrder';

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
  const { loginUser } = useSessionStore(state => state);

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
                {currentWorkOrder.stateWorkOrder != StateWorkOrder.Closed ? (
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
                {currentWorkOrder.stateWorkOrder != StateWorkOrder.Closed ? (
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
      </table>
    </div>
  );
}
