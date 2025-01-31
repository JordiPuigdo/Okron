'use client';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import {
  DowntimesReasonsType,
  OriginDowntime,
} from 'app/interfaces/Production/Downtimes';
import { DowntimesTicketReport } from 'app/interfaces/Production/DowntimesTicketReport';
import {
  calculateTimeDifference,
  formatDate,
  translateDowntimeReasonType,
} from 'app/utils/utils';
import ca from 'date-fns/locale/ca';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Button } from 'designSystem/Button/Buttons';
import Link from 'next/link';

import {
  calculateDowntimeCount,
  calculateTotalDowntimes,
  filterAssets,
} from './downtimeUtils';

dayjs.extend(utc);
dayjs.extend(timezone);
interface DowntimeReportProps {
  downtimesTicketReport: DowntimesTicketReport[];
  from: Date;
  to: Date;
  setFrom: (date: Date) => void;
  setTo: (date: Date) => void;
  reloadData: () => void;
}

const DowntimeReport: React.FC<DowntimeReportProps> = ({
  downtimesTicketReport,
  from,
  to,
  setFrom,
  setTo,
  reloadData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());
  const [onlyTickets, setOnlyTickets] = useState(false);

  const toggleExpand = (assetCode: string) => {
    setExpandedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetCode)) {
        newSet.delete(assetCode);
      } else {
        newSet.add(assetCode);
      }
      return newSet;
    });
  };

  const renderDowntimeTree = (
    report: DowntimesTicketReport[],
    level: number = 0
  ) => {
    return report.map((asset, assetIndex) => {
      const isExpanded = expandedAssets.has(asset.assetCode);
      const downtimeCount = calculateDowntimeCount([asset]);
      const totalTime = calculateTotalDowntimes([asset]);
      const hasChildren = asset.assetChild && asset.assetChild.length > 0;

      return (
        <div
          key={assetIndex}
          className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 mb-4 ${
            level > 0 ? 'ml-6' : ''
          }`}
        >
          <div
            className={`mb-4 flex items-center justify-between ${
              (hasChildren || downtimeCount > 0) && 'cursor-pointer'
            } ${downtimeCount > 0 && 'bg-green-200 p-2 rounded-lg'}`}
            onClick={() =>
              (hasChildren || downtimeCount > 0) &&
              toggleExpand(asset.assetCode)
            }
          >
            <h2 className="text-xl font-semibold text-gray-700">
              {asset.assetCode} - {asset.assetDescription} ({downtimeCount}{' '}
              Tickets) {totalTime}
            </h2>
            {(hasChildren || downtimeCount > 0) && (
              <span
                className="text-gray-500 cursor-pointer"
                onClick={() => toggleExpand(asset.assetCode)}
              >
                {isExpanded ? '▲' : '▼'}
              </span>
            )}
          </div>

          {isExpanded && (
            <>
              <div className="space-y-4">
                {asset.downtimesTicketReportList.map((workOrder, workIndex) => (
                  <div
                    key={workIndex}
                    className="bg-gray-100 rounded-lg p-3 shadow-inner"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-2 bg-gray-300 p-2 rounded-lg">
                      <Link href={`/workOrders/${workOrder.workOrderId}`}>
                        {workOrder.workOrderCode} -{' '}
                        {workOrder.workOrderDescription} -{' '}
                        {workOrder.downtimeReason}
                      </Link>
                    </h3>
                    <div className={`flex flex-col gap-2`}>
                      {workOrder.downtimesWorkOrder.map(
                        (downtime, downtimeIndex) => (
                          <div
                            key={downtimeIndex}
                            className={`flex flex-row gap-4 text-sm p-2 rounded shadow-sm ${
                              downtime.originDownTime ===
                              OriginDowntime.Production
                                ? 'bg-red-700'
                                : 'bg-blue-700'
                            }`}
                          >
                            <div className="flex flex-col w-full gap-2">
                              <div className="flex gap-2">
                                <div className="flex flex-row gap-1">
                                  <span className="text-white font-bold">
                                    Inici:
                                  </span>
                                  <span className="text-white">
                                    {formatDate(downtime.startTime)}
                                  </span>
                                  <span className="text-white"> - </span>
                                  <span className="text-white font-bold">
                                    Final:
                                  </span>
                                  <span className="text-white">
                                    {formatDate(downtime.endTime)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-1">
                                <span className="text-white font-semibold">
                                  Total:
                                </span>
                                <span className="text-white">
                                  {calculateTimeDifference(
                                    downtime.startTime,
                                    downtime.endTime
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex w-full justify-end">
                              <div className="flex flex-col gap-2 items-end">
                                <span className="text-white font-semibold">
                                  {translateDowntimeReasonType(
                                    downtime.originDownTime as unknown as DowntimesReasonsType
                                  )}
                                </span>
                                <span className="text-white">
                                  {downtime.operator.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {(hasChildren || asset.downtimesTicketReportList.length > 0) && (
                <div className="mt-4">
                  {renderDowntimeTree(asset.assetChild, level + 1)}
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  const filteredData = filterAssets(
    downtimesTicketReport,
    searchQuery.toLowerCase(),
    onlyTickets
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Report Aturades
      </h1>
      <div className="mb-6 ">
        <div className="flex gap-4 mb-4">
          <DatePicker
            selected={from}
            onChange={e => (e ? setFrom(e) : setFrom(new Date()))}
            locale={ca}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 rounded-md mr-4 w-full"
          />
          <DatePicker
            selected={to}
            onChange={e => (e ? setTo(e) : setTo(new Date()))}
            dateFormat="dd/MM/yyyy"
            locale={ca}
            className="border border-gray-300 p-2 rounded-md mr-4 w-full"
          />

          <Button type="create" onClick={() => reloadData}>
            Buscar
          </Button>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setOnlyTickets(!onlyTickets)}
          >
            <div className="flex flex-col">
              <span>Només</span>
              <span>Tickets</span>
            </div>
            <input
              type="checkbox"
              className="flex cursor-pointer"
              checked={onlyTickets}
              onChange={e => setOnlyTickets(e.target.checked)}
            />
          </div>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar per equip, codi d'operació o motiu"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      {downtimesTicketReport.length === 0 ? (
        <p className="text-center text-gray-500">
          No hi ha registres amb aquest filtre.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {renderDowntimeTree(filteredData)}
        </div>
      )}
    </div>
  );
};

export default DowntimeReport;
