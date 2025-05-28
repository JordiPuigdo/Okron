import { OriginDowntime } from 'app/interfaces/Production/Downtimes';
import {
  DowntimesTicketReport,
  DowntimesTicketReportList,
  DowntimesTicketReportModel,
} from 'app/interfaces/Production/DowntimesTicketReport';
import WorkOrder from 'app/interfaces/workOrder';
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
  downtimeFilter: OriginDowntime.Maintenance | OriginDowntime.Production
): string => {
  let totalSeconds = 0;

  workOrder.downtimesWorkOrder
    ?.filter(x => x.originDownTime == downtimeFilter)
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
  noMaintenanceIntervention = false
): DowntimesTicketReport[] => {
  return assets
    .map(asset => {
      const matchingDowntimes = asset.downtimesTicketReportList.filter(
        workOrder => {
          const matchesQuery = [
            workOrder.workOrderCode,
            workOrder.workOrderDescription,
            workOrder.downtimeReason,
          ].some(field => field?.toLowerCase().includes(query.toLowerCase()));

          const hasNoMaintenance = noMaintenanceIntervention
            ? !workOrder.downtimesWorkOrder.some(
                downtime =>
                  downtime.originDownTime === OriginDowntime.Maintenance
              )
            : true;

          return matchesQuery && hasNoMaintenance;
        }
      );

      const matchesCurrentAsset =
        asset.assetCode?.toLowerCase().includes(query.toLowerCase()) ||
        asset.assetDescription?.toLowerCase().includes(query.toLowerCase()) ||
        matchingDowntimes.length > 0;

      const filteredChildren = asset.assetChild
        ? filterAssets(
            asset.assetChild,
            query,
            onlyTickets,
            noMaintenanceIntervention
          )
        : [];

      const hasDowntimes = asset.downtimesTicketReportList.length > 0;
      const hasChildrenWithDowntimes = filteredChildren.length > 0;

      if (onlyTickets && !hasDowntimes && !hasChildrenWithDowntimes) {
        return null;
      }

      const hasNoMaintenanceDowntimes = noMaintenanceIntervention
        ? asset.downtimesTicketReportList.some(
            workOrder =>
              !workOrder.downtimesWorkOrder.some(
                downtime =>
                  downtime.originDownTime === OriginDowntime.Maintenance
              )
          )
        : true;

      if (
        (matchesCurrentAsset || filteredChildren.length > 0) &&
        (!noMaintenanceIntervention ||
          hasNoMaintenanceDowntimes ||
          filteredChildren.length > 0)
      ) {
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
