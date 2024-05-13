"use client";
import { useSessionStore } from "app/stores/globalStore";
import { useEffect, useState } from "react";
import WorkOrderTable from "app/(pages)/workOrders/components/WorkOrderTable";

export default function WorkOrderComponent() {
  const { operatorLogged } = useSessionStore((state) => state);
  const [operatorId, setOperatorId] = useState<string | "">("");

  useEffect(() => {
    operatorLogged !== undefined
      ? setOperatorId(operatorLogged.idOperatorLogged)
      : setOperatorId("");
  }, [operatorLogged]);

  return (
    <>
      {operatorId !== "" ? (
        <WorkOrderTable
          enableDelete={false}
          enableEdit={false}
          enableFilters={false}
          operatorId={operatorId}
          enableDetail={false}
        />
      ) : (
        <></>
      )}
    </>
  );
}
