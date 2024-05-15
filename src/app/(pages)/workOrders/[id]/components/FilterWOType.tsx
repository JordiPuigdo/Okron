"use client";
import { WorkOrderType } from "app/interfaces/workOrder";
import { useSessionStore } from "app/stores/globalStore";

interface FilterWOTypeProps {
  onClick: (type: WorkOrderType) => void;
}

export default function FilterWOType({ onClick }: FilterWOTypeProps) {
  const { operatorLogged } = useSessionStore((state) => state);
  if (operatorLogged == undefined) return <></>;
  return (
    <div className="flex flex-row gap-4 items-center bg-white rounded-xl p-4 font-semibold  hover:cursor-pointer">
      <span
        className="text-white rounded-full p-3 w-full text-center bg-okron-corrective font-semibold"
        onClick={() => onClick(WorkOrderType.Corrective)}
      >
        Correctius
      </span>
      <span
        className="text-white rounded-full p-3 w-full text-center bg-okron-preventive font-semibold hover:cursor-pointer"
        onClick={() => onClick(WorkOrderType.Preventive)}
      >
        Preventius
      </span>
    </div>
  );
}
