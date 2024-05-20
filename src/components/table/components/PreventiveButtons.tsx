import { SvgRepeat, SvgSpinner } from "app/icons/icons";
import { Preventive } from "app/interfaces/Preventive";
import PreventiveService from "app/services/preventiveService";
import { useState } from "react";

interface PreventiveButtonsProps {
  preventive: Preventive;
}

export const PreventiveButtons = ({ preventive }: PreventiveButtonsProps) => {
  const preventiveService = new PreventiveService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [isLoading, setIsLoading] = useState(false);
  const handleForceExecute = async (id: string) => {
    setIsLoading(true);
    await preventiveService
      .ForceExecutePreventive(id)
      .then((data) => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("Error executing preventive:", error);
      });
  };
  if (preventive.lastExecution == null) return <></>;
  return (
    <div
      className="flex items-center text-white rounded-xl bg-okron-btCreate hover:bg-okron-btCreateHover hover:cursor-pointer"
      onClick={() => handleForceExecute(preventive.id)}
    >
      {isLoading ? (
        <SvgSpinner className="p-2" />
      ) : (
        <SvgRepeat className="p-2" />
      )}
    </div>
  );
};
