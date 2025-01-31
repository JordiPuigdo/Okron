import { OriginDowntime } from 'app/interfaces/Production/Downtimes';
import {
  DowntimesTicketReport,
  DowntimesTicketReportModel,
} from 'app/interfaces/Production/DowntimesTicketReport';

export const calculateDowntimeCount = (
  report: DowntimesTicketReport[]
): number => {
  return report.reduce((total, asset) => {
    const childCount = calculateDowntimeCount(asset.assetChild || []);
    const currentCount = asset.downtimesTicketReportList.length;
    return total + currentCount + childCount;
  }, 0);
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

              return workOrderAcc + timeToSeconds(workOrder.totalTime);
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
    (acc, { totalTime, originDownTime }) => {
      if (!totalTime) return acc;
      if (downtimeFilter && originDownTime !== filterMap[downtimeFilter])
        return acc;
      return acc + timeToSeconds(totalTime);
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

const timeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const filterAssets = (
  assets: DowntimesTicketReport[],
  query: string,
  onlyTickets = false
): DowntimesTicketReport[] => {
  return assets
    .map(asset => {
      const matchingDowntimes = asset.downtimesTicketReportList.filter(
        workOrder =>
          [
            workOrder.workOrderCode,
            workOrder.workOrderDescription,
            workOrder.downtimeReason,
          ].some(field => field.toLowerCase().includes(query))
      );

      const matchesCurrentAsset =
        asset.assetCode.toLowerCase().includes(query) ||
        asset.assetDescription.toLowerCase().includes(query) ||
        matchingDowntimes.length > 0;

      const filteredChildren = asset.assetChild
        ? filterAssets(asset.assetChild, query, onlyTickets)
        : [];

      const hasDowntimes = asset.downtimesTicketReportList.length > 0;
      const hasChildrenWithDowntimes = filteredChildren.length > 0;

      if (onlyTickets && !hasDowntimes && !hasChildrenWithDowntimes) {
        return null;
      }

      if (
        matchesCurrentAsset ||
        (filteredChildren && filteredChildren.length > 0)
      ) {
        return { ...asset, assetChild: filteredChildren || [] };
      }

      return null;
    })
    .filter((asset): asset is DowntimesTicketReport => asset !== null);
};
