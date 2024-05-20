"use client";

import { SvgSpinner } from "app/icons/icons";
import { Preventive } from "app/interfaces/Preventive";
import { UserPermission } from "app/interfaces/User";
import PreventiveService from "app/services/preventiveService";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { formatDate } from "app/utils/utils";
import { Button } from "designSystem/Button/Buttons";
import { useState } from "react";

interface PreventiveCreateds {
  key: Preventive;
  value: number;
}

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
      const prevCreat: PreventiveCreateds[] = [];
      preventives?.forEach((x) => {
        if (prevCreat.find((y) => y.key.id === x.id)) {
          prevCreat.find((y) => y.key.id === x.id)!.value++;
        } else {
          prevCreat.push({ key: x, value: 0 });
        }
      });
      setPreventivesCreated(prevCreat.map((x) => x.key));
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
        <div className="flex flex-col gap-1 ">
          <Button
            type="others"
            onClick={generateWorkOrders}
            className="bg-orange-500 text-sm text-white p-2 rounded-md font-semibold hover:bg-orange-600 "
            customStyles="flex"
          >
            Generar Revisions {formatDate(new Date(), false, false)}
            {isLoading && <SvgSpinner className="w-6 h-6" />}
          </Button>
          {preventivesCreated != undefined &&
            preventivesCreated?.length > 0 && (
              <>
                <p className="text-black font-semibold">
                  {(preventivesCreated?.length || 0 > 0) &&
                    "Revisions creades per avui:"}
                </p>
                {preventivesCreated?.map((preventive, index) => (
                  <div key={index}>
                    {preventive.code} - {preventive.description}
                  </div>
                ))}
                {message != "" && (
                  <span className="text-red-500">{message}</span>
                )}
              </>
            )}
        </div>
      </>
    );
  else return <></>;
};

export default GeneratePreventive;
