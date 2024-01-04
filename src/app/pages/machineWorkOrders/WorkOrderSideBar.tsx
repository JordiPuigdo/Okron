import WorkOrder, { CreateWorkOrderRequest } from "interfaces/workOrder";
import { useEffect, useState } from "react";
import WorkOrderService from "services/workOrderService";
import { useForm, Controller } from "react-hook-form";
import WorkOrderForm from "./WorkOrderForm";
import Machine from "interfaces/machine";

interface SidebarProps {
  id?: string;
  close: () => void;
}

const WorkOrderSideBar: React.FC<SidebarProps> = ({ close, id }) => {
  const workOrderService = new WorkOrderService("http://localhost:5254/api/");
  const [WorkOrder, setWorkOrder] = useState<WorkOrder | undefined>(undefined);
  const { handleSubmit, control, setValue } = useForm<WorkOrder>({
    defaultValues: WorkOrder,
  });

  const loadWorkOrder = async () => {
    try {
      if (id != undefined) {
        await workOrderService
          .getWorkOrderById(id)
          .then((data) => {
            if (data) {
              setWorkOrder(data);
              Object.keys(data).forEach((key) => {
                const typedKey = key as keyof WorkOrder;
                setValue(key as keyof WorkOrder, data[typedKey]);
              });
            }
          })
          .catch((error) => {
            console.error("Error loading WorkOrder:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching WorkOrder:", error);
    }
  };

  useEffect(() => {
    loadWorkOrder();
  }, [id]);

  const onSubmit = async (data: WorkOrder) => {
    try {
      await workOrderService.updateWorkOrder(data);
      close();
    } catch (error) {
      console.error("Error updating WorkOrder:", error);
    }
  };

  const handleWorkOrderSubmit = async (
    createWorkOrderRequest: CreateWorkOrderRequest,
    machineId: string
  ) => {
    try {
      createWorkOrderRequest.machineId = machineId || "";
      /* await machineService.createMachineWorkOrder(
        createWorkOrderRequest,
        machine?.id || ""
      );
      loadMachines();
      setCreateWorkOrderVisibility((prevState) => ({
        ...prevState,
        [machine?.id || ""]: false,
      }));*/
    } catch (error) {
      console.error("Error creating machine WorkOrder:", error);
    }
  };
  return (
    <aside className="sidebar">
      <div className="p-4">
        {WorkOrder ? (
          /*<form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <h2 className="text-xl font-semibold mb-4">Editar Operació</h2>

            <div className="mb-4">
              <label className="mr-2">Descripció:</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    defaultValue={WorkOrder?.description || ""}
                  />
                )}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 mr-2 rounded-md"
            >
              Actualitzar
            </button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md"
              onClick={close}
            >
              Cancelar
            </button>
          </form>*/
          <WorkOrderForm
            onSubmit={(WorkOrderRequest) =>
              handleWorkOrderSubmit(WorkOrderRequest, WorkOrder.machineId)
            }
            machineName={""}
            WorkOrderCreated={WorkOrder}
          />
        ) : (
          <>Loading</>
        )}
      </div>
    </aside>
  );
};

export default WorkOrderSideBar;
