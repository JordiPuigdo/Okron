import WorkOrder, { StateWorkOrder } from "app/interfaces/workOrder";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import WorkOrderService from "components/services/workOrderService";
import SidebarWorkOrder from "./backup_WorkOrderSideBar";
import React from "react";

interface WorkOrdersPerMachineProps {
  id: string;
  machineName: string;
  onDetailClick: (WorkOrder: WorkOrder) => void;
}

const WorkOrdersPerMachine: React.FC<WorkOrdersPerMachineProps> = ({
  id,
  onDetailClick,
}) => {
  const router = useRouter();
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [WorkOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedWorkOrder, setEditedWorkOrder] = useState<WorkOrder | null>(
    null
  );
  const [reloadData, setReloadData] = useState(true);

  const formatDateTime = (isoDateTime: any) => {
    const options: any = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(isoDateTime).toLocaleString("es-ES", options);
  };

  const stateWorkOrderStrings: Record<StateWorkOrder, string> = {
    [StateWorkOrder.Waiting]: "En Espera",
    [StateWorkOrder.OnGoing]: "En Curs",
    [StateWorkOrder.Paused]: "Pausada",
    [StateWorkOrder.Finished]: "Acabada",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const data = await workOrderService.getWorkOrdersById(id as string);
          console.log(data);
          setWorkOrders(data);
        }
      } catch (error) {
        console.error("Error fetching WorkOrders:", error);
      }
      setReloadData(false);
    };
    if (reloadData) fetchData();
  }, [id, reloadData]);

  const handleEditClick = (WorkOrder: WorkOrder) => {
    setEditedWorkOrder(WorkOrder);
    setIsEditModalVisible(!isEditModalVisible);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setReloadData(true);
  };

  return (
    <div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Descripció</th>
            <th className="border p-2">Data Inici</th>
            <th className="border p-2">Estat</th>
            <th className="border p-2">Accions</th>
          </tr>
        </thead>
        <tbody>
          {WorkOrders.map((op) => (
            <tr key={op.id}>
              <td className="border p-2">{op.description}</td>
              <td className="border p-2">{formatDateTime(op.startTime)}</td>
              <td className="border p-2">
                {stateWorkOrderStrings[op.stateWorkOrder]}
              </td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 mx-1 rounded-md"
                  onClick={() => handleEditClick(op)}
                >
                  Editar
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 mx-1 rounded-md">
                  Eliminar
                </button>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-2 mx-1 rounded-md"
                  onClick={() => onDetailClick(op)}
                >
                  Detall
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalVisible && (
        <SidebarWorkOrder
          close={() => handleCloseEditModal()}
          id={editedWorkOrder?.id}
        ></SidebarWorkOrder>
      )}
    </div>
  );
};

export default WorkOrdersPerMachine;
