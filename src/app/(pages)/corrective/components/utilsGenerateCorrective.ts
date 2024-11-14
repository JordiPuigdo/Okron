import { Corrective } from 'app/interfaces/Corrective';
import { DowntimesReasons } from 'app/interfaces/Production/Downtimes';
import { LoginUser, OperatorLogged, UserType } from 'app/interfaces/User';
import {
  CreateWorkOrderRequest,
  StateWorkOrder,
} from 'app/interfaces/workOrder';

export function isValidData(
  corrective: Corrective,
  selectedId: string,
  loginUser: LoginUser,
  selectedOperator: string[],
  selectedDowntimeReasons: DowntimesReasons | undefined
): boolean {
  const hasDescription = corrective.description?.trim().length > 0;
  const isMaintenanceUser = loginUser?.userType === UserType.Maintenance;
  const requiresDowntimeReasons = !isMaintenanceUser;
  const hasDowntimeReasons =
    !requiresDowntimeReasons || !!selectedDowntimeReasons;

  return (
    hasDescription &&
    !!selectedId &&
    (isMaintenanceUser || !!selectedOperator) &&
    hasDowntimeReasons
  );
}

export function convertToCreateWorkOrderRequest(
  corrective: Corrective,
  selectedId: string,
  loginUser: LoginUser,
  selectedOperator: string[],
  selectedDowntimeReasons: DowntimesReasons | undefined,
  operatorLogged: OperatorLogged
): CreateWorkOrderRequest {
  const createWorkOrderRequest: CreateWorkOrderRequest = {
    code: corrective.code,
    description: corrective.description,
    initialDateTime: corrective.startTime,
    assetId: selectedId,
    operatorId: selectedOperator.map(operator => operator),
    stateWorkOrder:
      loginUser?.userType !== UserType.Maintenance
        ? StateWorkOrder.Open
        : corrective.stateWorkOrder,
    workOrderType: 0,
    userId: loginUser?.agentId,
    operatorCreatorId: operatorLogged!.idOperatorLogged,
    originWorkOrder: loginUser!.userType,
    downtimeReasonId: selectedDowntimeReasons?.id || '',
  };
  return createWorkOrderRequest;
}
