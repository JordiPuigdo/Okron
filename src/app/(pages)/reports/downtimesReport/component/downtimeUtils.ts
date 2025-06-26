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
  const filterMap = {
    M: OriginDowntime.Maintenance,
    P: OriginDowntime.Production,
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
                workOrder.originDownTime !== filterMap[downtimeFilter]
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
      // Filter downtimes based on all conditions
      const matchingDowntimes = asset.downtimesTicketReportList.filter(
        workOrder => {
          // Check text search match
          const matchesQuery = [
            workOrder.workOrderCode,
            workOrder.workOrderDescription,
            workOrder.downtimeReason,
          ].some(field => field?.toLowerCase().includes(query.toLowerCase()));

          // Check maintenance intervention
          const hasNoMaintenance = noMaintenanceIntervention
            ? !workOrder.downtimesWorkOrder.some(
                downtime =>
                  downtime.originDownTime === OriginDowntime.Maintenance
              )
            : true;

          const hasNoProduction = noProductionIntervention
            ? workOrder.downtimesWorkOrder.length === 0 ||
              workOrder.downtimesWorkOrder.some(
                downtime =>
                  downtime.originDownTime === OriginDowntime.MaintenanceOrders
              )
            : true;

          // Check downtime reason match (if any reasons are selected)
          const matchesReason =
            downtimeReasons.length > 0
              ? downtimeReasons.includes(workOrder.downtimeReason || '')
              : true;

          return (
            matchesQuery && hasNoMaintenance && hasNoProduction && matchesReason
          );
        }
      );

      // Check if asset itself matches search (code/description)
      const matchesCurrentAsset =
        asset.assetCode?.toLowerCase().includes(query.toLowerCase()) ||
        asset.assetDescription?.toLowerCase().includes(query.toLowerCase()) ||
        matchingDowntimes.length > 0;

      // Recursively filter child assets
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

      // Check ticket-only filter condition
      const hasDowntimes = asset.downtimesTicketReportList.length > 0;
      const hasChildrenWithDowntimes = filteredChildren.length > 0;

      if (onlyTickets && !hasDowntimes && !hasChildrenWithDowntimes) {
        return null;
      }

      // Check maintenance intervention condition
      const hasNoMaintenanceDowntimes = noMaintenanceIntervention
        ? asset.downtimesTicketReportList.some(
            workOrder =>
              !workOrder.downtimesWorkOrder.some(
                downtime =>
                  downtime.originDownTime === OriginDowntime.Maintenance
              )
          )
        : true;

      const hasNoProductionDowntimes = noProductionIntervention
        ? asset.downtimesTicketReportList.some(
            workOrder =>
              workOrder.downtimesWorkOrder.length === 0 ||
              workOrder.downtimesWorkOrder.some(
                downtime =>
                  downtime.originDownTime === OriginDowntime.MaintenanceOrders
              )
          )
        : true;

      // Include asset if:
      // 1. It matches search OR has matching children
      // AND
      // 2. If noMaintenanceIntervention is true, it has non-maintenance downtimes OR matching children
      // AND
      // 3. If downtimeReasons are specified, it has matching downtimes OR matching children
      const shouldIncludeAsset =
        (matchesCurrentAsset || filteredChildren.length > 0) &&
        (!noMaintenanceIntervention ||
          hasNoMaintenanceDowntimes ||
          filteredChildren.length > 0) &&
        (!noProductionIntervention ||
          hasNoProductionDowntimes ||
          filteredChildren.length > 0) &&
        (downtimeReasons.length === 0 ||
          matchingDowntimes.length > 0 ||
          filteredChildren.length > 0);

      if (shouldIncludeAsset) {
        return {
          ...asset,
          downtimesTicketReportList: matchingDowntimes,
          assetChild: filteredChildren,
        };
      }

      return null;
    })
    .filter((asset): asset is DowntimesTicketReport => asset !== null);
};
