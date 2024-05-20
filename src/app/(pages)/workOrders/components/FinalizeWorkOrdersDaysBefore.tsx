"use client";

import { SvgSpinner } from "app/icons/icons";
import { UserPermission } from "app/interfaces/User";
import WorkOrderService from "app/services/workOrderService";
import { useSessionStore } from "app/stores/globalStore";
import { formatDate } from "app/utils/utils";
import { useState } from "react";

interface FinalizeWorkOrdersDaysBeforeProps {
  onFinalizeWorkOrdersDayBefore?: () => void;
}

const FinalizeWorkOrdersDaysBefore: React.FC<
  FinalizeWorkOrdersDaysBeforeProps
> = ({ onFinalizeWorkOrdersDayBefore }) => {
  const { loginUser } = useSessionStore((state) => state);
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalizeWorkOrdersDayBefore = async () => {
    setIsLoading(true);
    const today = new Date();
    await workOrderService.finishWorkOrdersByDate(today);
    if (onFinalizeWorkOrdersDayBefore) onFinalizeWorkOrdersDayBefore();
    setIsLoading(false);
  };

  if (loginUser?.permission != UserPermission.Administrator) return <></>;
  return (
    <button
      type="button"
      className="bg-orange-500 text-sm text-white p-2 rounded-md font-semibold hover:bg-orange-600 justifty-center flex items-center justify-center"
      onClick={(e) => handleFinalizeWorkOrdersDayBefore()}
    >
      Finalitzar Ordres{isLoading && <SvgSpinner />}
    </button>
  );
};

export default FinalizeWorkOrdersDaysBefore;
