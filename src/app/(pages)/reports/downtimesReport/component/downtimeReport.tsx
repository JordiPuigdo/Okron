'use client';
import 'react-datepicker/dist/react-datepicker.css';

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useScrollToElement } from 'app/hooks/useScrollToId';
import { useSyncDatesFromURL } from 'app/hooks/useSyncDatesFromURL';
import { SvgSpinner } from 'app/icons/icons';
import { DowntimesTicketReport } from 'app/interfaces/Production/DowntimesTicketReport';
import ca from 'date-fns/locale/ca';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  calculateDowntimeCount,
  calculateTotalDowntimes,
  filterAssets,
} from './downtimeUtils';
import WorkOrderCard from './workOrderCard';

dayjs.extend(utc);
dayjs.extend(timezone);
interface DowntimeReportProps {
  downtimesTicketReport: DowntimesTicketReport[];
  from: Date;
  to: Date;
  setFrom: (date: Date) => void;
  setTo: (date: Date) => void;
  reloadData: () => void;
  isLoading: boolean;
}

type OptionType = {
  value: string;
  label: string;
};

const DowntimeReport: React.FC<DowntimeReportProps> = ({
  downtimesTicketReport,
  from,
  to,
  setFrom,
  setTo,
  reloadData,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());
  const [onlyTickets, setOnlyTickets] = useState(true);
  const [onlyProduction, setOnlyProduction] = useState(false);
  const [onlyMaintenance, setOnlyMaintenance] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const expandedTargetId = searchParams.get('id');
  const textSearched = searchParams.get('search');
  const [shouldScroll, setShouldScroll] = useState(true);

  useSyncDatesFromURL(setFrom, setTo);

  useScrollToElement({
    id: expandedTargetId,
    isLoading,
    prefixId: 'workorder-',
    shouldScroll: shouldScroll,
  });

  function getAllDowntimeReasons(assets: DowntimesTicketReport[]): string[] {
    return assets.flatMap(asset => {
      // Get downtime reasons from the current asset
      const currentReasons = asset.downtimesTicketReportList
        .map(workOrder => workOrder.downtimeReason)
        .filter(Boolean); // Optional: removes null/undefined

      // Get downtime reasons from child assets (recursive)
      const childReasons = asset.assetChild
        ? getAllDowntimeReasons(asset.assetChild)
        : [];

      // Combine current and child reasons
      return [...currentReasons, ...childReasons];
    });
  }

  const allReasons = [...new Set(getAllDowntimeReasons(downtimesTicketReport))];
  const downtimeReasonOptions: OptionType[] = allReasons.map(reason => ({
    value: reason,
    label: reason,
  }));

  const filteredData = filterAssets(
    downtimesTicketReport,
    searchQuery.toLowerCase(),
    onlyTickets,
    onlyProduction,
    onlyMaintenance,
    selectedOptions.map(option => option.value)
  );

  const findPathToWorkOrderId = (
    data: DowntimesTicketReport[],
    targetId: string,
    path: string[] = []
  ): string[] | null => {
    for (const asset of data) {
      const newPath = [...path, asset.assetCode];

      if (
        asset.downtimesTicketReportList.some(w => w.workOrderId === targetId)
      ) {
        return newPath;
      }

      if (asset.assetChild?.length) {
        const result = findPathToWorkOrderId(
          asset.assetChild,
          targetId,
          newPath
        );
        if (result) return result;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!expandedTargetId || !shouldScroll) {
      setIsLoadingData(false);
      return;
    }

    const path = findPathToWorkOrderId(filteredData, expandedTargetId!);

    if (path) {
      setExpandedAssets(prev => {
        const newSet = new Set(prev);
        let changed = false;
        path.forEach(code => {
          if (!newSet.has(code)) {
            newSet.add(code);
            changed = true;
          }
        });

        return changed ? newSet : prev;
      });
      setTimeout(() => {
        setShouldScroll(false);
      }, 500);
    }

    setIsLoadingData(false);
    if (textSearched) {
      setSearchQuery(textSearched);
    }
  }, [expandedTargetId, isLoadingData, filteredData]);

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

  const handleChange = (selected: readonly OptionType[]) => {
    setSelectedOptions(selected ? [...selected] : []);
  };

  const renderDowntimeTree = (
    report: DowntimesTicketReport[],
    level: number = 0
  ) => {
    return report.map((asset, assetIndex) => {
      const isExpanded = expandedAssets.has(asset.assetCode);
      const downtimeCount = calculateDowntimeCount([asset]);
      const totalTime = calculateTotalDowntimes([asset]);
      const totalTimeProd = calculateTotalDowntimes([asset], 'P');

      const totalTimeMaintenance = calculateTotalDowntimes([asset], 'M');

      const hasChildren = asset.assetChild && asset.assetChild.length > 0;

      return (
        <div
          key={assetIndex}
          className={`ml-${level * 4} border-l-4 border-gray-300 pl-4`}
        >
          <div
            className={`shadow-md rounded-lg p-4 bg-white border border-gray-200 mb-4`}
          >
            <div
              className={`flex items-center justify-between ${
                (hasChildren || downtimeCount > 0) && 'cursor-pointer'
              } ${
                downtimeCount > 0
                  ? 'border-2 border-black bg-orange-100 p-2 rounded-lg'
                  : ''
              }`}
              onClick={() =>
                (hasChildren || downtimeCount > 0) &&
                toggleExpand(asset.assetCode)
              }
            >
              <div className="flex flex-col w-full p-4 bg-gray-100 rounded-md">
                <div className="flex items-center gap-2">
                  {(hasChildren || downtimeCount > 0) && (
                    <span className="focus:outline-none rounded-full bg-blue-500 text-white px-2 py-1 cursor-pointer">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  )}
                  <span className="text-xl font-bold text-gray-800">
                    {asset.assetCode} - {asset.assetDescription}
                  </span>
                  <span className="text-sm text-gray-500">Nivell: {level}</span>
                </div>

                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex-1 p-2 text-center bg-red-200 rounded-md">
                    <span className="block text-sm text-gray-600">
                      Temps Aturat Producció
                    </span>
                    <span className="text-lg font-semibold">
                      {totalTimeProd}
                    </span>
                  </div>
                  <div className="flex-1 p-2 text-center bg-blue-200 rounded-md">
                    <span className="block text-sm text-gray-600">
                      Temps Intervingut per Manteniment
                    </span>
                    <span className="text-lg font-semibold">
                      {totalTimeMaintenance}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="pl-4 mt-4">
                {asset.downtimesTicketReportList.map((workOrder, workIndex) => (
                  <WorkOrderCard
                    key={`workorder-${workOrder.workOrderId}`}
                    workOrder={workOrder}
                    expandedTargetId={expandedTargetId}
                    from={from}
                    to={to}
                    search={searchQuery}
                  />
                ))}

                {hasChildren && renderDowntimeTree(asset.assetChild, level + 1)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 bg-white rounded-xl p-4 shadow-md mb-12">
        <div className="w-full flex flex-row text-xl font-semibold p-2 items-center border-b-2 border-gray-300">
          <div className="flex cursor-pointer " onClick={() => router.back()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
          <div className="flex w-full text-center justify-center">
            Report Tickets
          </div>
        </div>
        <div className="mb-6 ">
          <div className="flex gap-4 mb-4 items-center">
            {!isLoadingData && (
              <div className="flex">
                <DatePicker
                  selected={from}
                  onChange={e => (e ? setFrom(e) : setFrom(new Date()))}
                  locale={ca}
                  dateFormat="dd/MM/yyyy"
                  className="border border-gray-300 p-2 rounded-md mr-4"
                  popperClassName="z-50"
                />
                <DatePicker
                  selected={to}
                  onChange={e => (e ? setTo(e) : setTo(new Date()))}
                  dateFormat="dd/MM/yyyy"
                  locale={ca}
                  className="border border-gray-300 p-2 rounded-md mr-4"
                  popperClassName="z-50"
                />
              </div>
            )}

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
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setOnlyProduction(!onlyProduction)}
            >
              <div className="flex flex-col">
                <span>Tickets Sense Temps de Manteniment</span>
              </div>
              <input
                type="checkbox"
                className="flex cursor-pointer"
                checked={onlyProduction}
                onChange={e => setOnlyProduction(e.target.checked)}
              />
            </div>
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setOnlyMaintenance(!onlyMaintenance)}
            >
              <div className="flex flex-col">
                <span>Només Correctius</span>
              </div>
              <input
                type="checkbox"
                className="flex cursor-pointer"
                checked={onlyMaintenance}
                onChange={e => setOnlyMaintenance(e.target.checked)}
              />
            </div>
            <div className="flex items-center w-full">
              <Select
                isMulti
                options={downtimeReasonOptions}
                value={selectedOptions}
                onChange={handleChange}
                className="w-full"
                classNamePrefix="react-select"
                placeholder="Motiu"
                noOptionsMessage={() => 'No hi ha motius disponibles'}
                isClearable={true}
                isSearchable={true}
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
      </div>
      {isLoading ? (
        <div className="flex container mx-auto p-6 items-center justify-center">
          <SvgSpinner className="text-okron-main" />
        </div>
      ) : (
        <>
          {downtimesTicketReport.length === 0 ? (
            <p className="text-center text-gray-500">
              No hi ha registres amb aquest filtre.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {!isLoadingData && renderDowntimeTree(filteredData)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DowntimeReport;
