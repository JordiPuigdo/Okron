'use client';

import { useState } from 'react';
import { SvgSpinner } from 'app/icons/icons';
import { UserPermission } from 'app/interfaces/User';
import WorkOrderService from 'app/services/workOrderService';
import { useSessionStore } from 'app/stores/globalStore';
import { Button } from 'designSystem/Button/Buttons';

interface FinalizeWorkOrdersDaysBeforeProps {
  onFinalizeWorkOrdersDayBefore?: () => void;
}

const FinalizeWorkOrdersDaysBefore: React.FC<
  FinalizeWorkOrdersDaysBeforeProps
> = ({ onFinalizeWorkOrdersDayBefore }) => {
  const { loginUser } = useSessionStore(state => state);
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalizeWorkOrdersDayBefore = async () => {
    const isConfirmed = window.confirm(
      'Segur que voleu finalitzar totes les ordres de treball pendents?'
    );
    if (!isConfirmed) return;

    setIsLoading(true);
    const today = new Date();
    await workOrderService.finishWorkOrdersByDate(today);
    if (onFinalizeWorkOrdersDayBefore) onFinalizeWorkOrdersDayBefore();
    setIsLoading(false);
  };

  if (loginUser?.permission != UserPermission.Administrator) return <></>;
  return (
    <div className="flex items-center">
      <Button
        customStyles="bg-orange-500 text-sm text-white rounded-md font-semibold hover:bg-orange-600 justifty-center flex items-center "
        onClick={() => handleFinalizeWorkOrdersDayBefore()}
      >
        Finalitzar Ordres{isLoading && <SvgSpinner />}
      </Button>
    </div>
  );
};

export default FinalizeWorkOrdersDaysBefore;
