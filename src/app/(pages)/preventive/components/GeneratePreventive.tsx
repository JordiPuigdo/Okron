"use client";

import { SvgSpinner } from "app/icons/icons";
import { Preventive } from "app/interfaces/Preventive";
import { UserPermission } from "app/interfaces/User";
import PreventiveService from "app/services/preventiveService";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { formatDate } from "app/utils/utils";
import { useState } from "react";

const GeneratePreventive = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preventivesCreated, setPreventivesCreated] = useState<
    Preventive[] | null
  >([]);
  const preventiveService = new PreventiveService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  const { loginUser } = useSessionStore((state) => state);

  const [message, setMessage] = useState("");

  const generateWorkOrders = async () => {
    setIsLoading(true);
    const preventives =
      await preventiveService.CreateWorkOrderPreventivePerDay();
    if (preventives?.length! > 0) {
      setPreventivesCreated(preventives);
      workOrderService.cleanCache();
      setTimeout(() => {
        setPreventivesCreated([]);
      }, 10000);
    } else {
      setMessage("Avui no hi ha revisions per crear");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }

    setIsLoading(false);
  };
  if (loginUser?.permission == UserPermission.Administrator)
    return (
      <>
        <button
          onClick={generateWorkOrders}
          className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 flex items-center gap-2"
        >
          Generar Revisions {formatDate(new Date(), false, false)}
          {isLoading && <SvgSpinner className="w-6 h-6" />}
        </button>

        <p className="text-black font-bold">
          {(preventivesCreated?.length || 0 > 0) &&
            "Revisions creades per avui:"}
        </p>
        {preventivesCreated?.map((preventive, index) => (
          <div key={index}>
            {preventive.code} - {preventive.description}
          </div>
        ))}
        {message != "" && <span className="text-red-500">{message}</span>}
      </>
    );
  else return <></>;
};

export default GeneratePreventive;
