import { Downtimes } from 'app/interfaces/Production/Downtimes';
import {
  formatDate,
  formatTimeSpan,
  translateOperatorType,
} from 'app/utils/utils';

interface DowntimesProps {
  downtimes: Downtimes[];
}

export default function DowntimesComponent({ downtimes }: DowntimesProps) {
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
          {downtimes.map((downtime, index) => (
            <tr key={index}>
              <td className="p-2 whitespace-nowrap w-1/4">
                {formatDate(downtime.startTime)}
              </td>
              <td className="p-2 whitespace-nowrap w-1/4">
                {downtime.endTime ? formatDate(downtime.endTime) : 'N/A'}
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
