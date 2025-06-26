import { OriginDowntime } from 'app/interfaces/Production/Downtimes';
import {
  DowntimesTicketReport,
  DowntimesTicketReportList,
  DowntimesTicketReportModel,
} from 'app/interfaces/Production/DowntimesTicketReport';
import dayjs from 'dayjs';

export const calculateDowntimeCount = (
  report: DowntimesTicketReport[]
): number => {
  return report.reduce((total, asset) => {
    const childCount = calculateDowntimeCount(asset.assetChild || []);
    const currentCount = asset.downtimesTicketReportList.length;
    return total + currentCount + childCount;
  }, 0);
};

export const calculateTotalDowntimesWorkOrder = (
  workOrder: DowntimesTicketReportList,
  downtimeFilter: OriginDowntime
): string => {
  let totalSeconds = 0;

  const validFilters = [downtimeFilter];
  if (downtimeFilter == OriginDowntime.Maintenance) {
    validFilters.push(OriginDowntime.MaintenanceOrders);
  }

  workOrder.downtimesWorkOrder
    ?.filter(x => validFilters.includes(x.originDownTime))
    .forEach(x => {
      totalSeconds += calculateTotalSecondsBetweenDates(x.startTime, x.endTime);
    });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(Math.floor(seconds)).padStart(2, '0')}`;
};

export const calculateTotalDowntimes = (
  report: DowntimesTicketReport[],
  downtimeFilter: 'M' | 'P' | '' = ''
): string => {
  const filterMap: Record<'M' | 'P', OriginDowntime[]> = {
    M: [OriginDowntime.Maintenance, OriginDowntime.MaintenanceOrders],
    P: [OriginDowntime.Production],
  };

  const sumDowntimes = (assets: DowntimesTicketReport[]): number => {
    return assets.reduce((total, asset) => {
      const childCount = sumDowntimes(asset.assetChild || []);

      const currentCount = asset.downtimesTicketReportList.reduce(
        (acc, ticket) => {
          const ticketTime = ticket.downtimesWorkOrder.reduce(
            (workOrderAcc, workOrder) => {
              if (!workOrder.totalTime) return workOrderAcc;
              if (
                downtimeFilter &&
                !filterMap[downtimeFilter].includes(workOrder.originDownTime)
              ) {
                return workOrderAcc;
              }

              return (
                workOrderAcc +
                calculateTotalSecondsBetweenDates(
                  workOrder.startTime,
                  workOrder.endTime
                )
              );
            },
            0
          );

          return acc + ticketTime;
        },
        0
      );

      return total + currentCount + childCount;
    }, 0);
  };

  const totalSeconds = sumDowntimes(report);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(Math.floor(seconds)).padStart(2, '0')}`;
};

export const calculateTotalDowntimeMWO = (
  downtimes: DowntimesTicketReportModel[],
  downtimeFilter: 'M' | 'P' | '' = ''
): string => {
  const filterMap = {
    M: OriginDowntime.Maintenance,
    P: OriginDowntime.Production,
  };

  const totalSeconds = downtimes.reduce(
    (acc, { startTime, endTime, originDownTime }) => {
      if (downtimeFilter && originDownTime !== filterMap[downtimeFilter])
        return acc;
      return acc + calculateTotalSecondsBetweenDates(startTime, endTime);
    },
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(Math.floor(seconds)).padStart(2, '0')}`;
};

export const calculateTotalSecondsBetweenDates = (
  startDate: string,
  endDate: string
): number => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const differenceInMilliseconds = end.diff(start);

  return differenceInMilliseconds / 1000;
};

const isMaintenance = (origin: OriginDowntime) =>
  [OriginDowntime.Maintenance, OriginDowntime.MaintenanceOrders].includes(
    origin
  );

const isProduction = (origin: OriginDowntime) =>
  origin === OriginDowntime.Production;

const matchesQuery = (text: string, query: string) =>
  text?.toLowerCase().includes(query.toLowerCase());

const hasDowntimeWithOrigin = (
  downtimes: DowntimesTicketReportModel[],
  predicate: (origin: OriginDowntime) => boolean
): boolean => {
  return downtimes.some(d => predicate(d.originDownTime));
};

const workOrderMatches = (
  workOrder: DowntimesTicketReportList,
  query: string,
  downtimeReasons: string[],
  noMaintenance: boolean,
  noProduction: boolean
): boolean => {
  const matchesText = [
    workOrder.workOrderCode,
    workOrder.workOrderDescription,
    workOrder.downtimeReason,
  ].some(field => matchesQuery(field || '', query));

  const maintenanceValid = noMaintenance
    ? !hasDowntimeWithOrigin(workOrder.downtimesWorkOrder, isMaintenance)
    : true;

  const productionValid = noProduction
    ? !hasDowntimeWithOrigin(workOrder.downtimesWorkOrder, isProduction)
    : true;

  const reasonMatch =
    downtimeReasons.length === 0 ||
    downtimeReasons.includes(workOrder.downtimeReason || '');

  return matchesText && maintenanceValid && productionValid && reasonMatch;
};

export const filterAssets = (
  assets: DowntimesTicketReport[],
  query: string,
  onlyTickets = false,
  noMaintenanceIntervention = false,
  noProductionIntervention = false,
  downtimeReasons: string[] = []
): DowntimesTicketReport[] => {
  return assets
    .map(asset => {
      const filteredDowntimes = asset.downtimesTicketReportList.filter(
        workOrder =>
          workOrderMatches(
            workOrder,
            query,
            downtimeReasons,
            noMaintenanceIntervention,
            noProductionIntervention
          )
      );

      const filteredChildren = asset.assetChild
        ? filterAssets(
            asset.assetChild,
            query,
            onlyTickets,
            noMaintenanceIntervention,
            noProductionIntervention,
            downtimeReasons
          )
        : [];

      const matchesAsset =
        matchesQuery(asset.assetCode, query) ||
        matchesQuery(asset.assetDescription, query) ||
        filteredDowntimes.length > 0;

      const shouldInclude = matchesAsset || filteredChildren.length > 0;

      if (!shouldInclude) return null;

      const hasAnyDowntime =
        filteredDowntimes.length > 0 || filteredChildren.length > 0;

      if (onlyTickets && !hasAnyDowntime) return null;

      return {
        ...asset,
        downtimesTicketReportList: filteredDowntimes,
        assetChild: filteredChildren,
      };
    })
    .filter((asset): asset is DowntimesTicketReport => asset !== null);
};
