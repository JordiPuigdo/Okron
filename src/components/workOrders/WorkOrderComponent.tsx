"use client";
import { useSessionStore } from "app/stores/globalStore";
import { useEffect, useState } from "react";
import WorkOrderTable from "app/(pages)/workOrders/components/WorkOrderTable";
import { WorkOrderType } from "app/interfaces/workOrder";

interface WorkOrderComponentProps {
  workOrderType?: WorkOrderType;
}
export default function WorkOrderComponent({
  workOrderType,
}: WorkOrderComponentProps) {
  const { operatorLogged } = useSessionStore((state) => state);
  const [operatorId, setOperatorId] = useState<string | "">("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    operatorLogged !== undefined
      ? setOperatorId(operatorLogged.idOperatorLogged)
      : setOperatorId("");
  }, [operatorLogged]);

  useEffect(() => {
    setRefresh(true);
  }, [workOrderType]);

  return (
    <>
      {operatorId !== "" ? (
        <WorkOrderTable
          enableDelete={false}
          enableEdit={false}
          enableFilters={false}
          operatorId={operatorId}
          enableDetail={false}
          workOrderType={workOrderType}
          refresh={refresh}
        />
      ) : (
        <></>
      )}
    </>
  );
}
