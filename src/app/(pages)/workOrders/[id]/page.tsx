"use client";

import Layout from "components/Layout";
import WorkOrderForm from "./old_WorkOrderForm";
import WorkOrder, { CreateWorkOrderRequest } from "interfaces/workOrder";
import Machine from "interfaces/machine";
import WorkOrderService from "services/workOrderService";
import WorkOrderEditForm from "./components/workOrderEditForm";

export default function EditWorkOrder({ params }: { params: { id: string } }) {
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const handleWorkOrderSubmit = async (
    updateWorkOrderRequest: CreateWorkOrderRequest,
    machine: Machine | null
  ) => {
    try {
      await workOrderService.updateWorkOrder(updateWorkOrderRequest);
      /*  createWorkOrderRequest.machineId = machine?.id || "";
      await machineService.createMachineWorkOrder(
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
    <Layout>
      <WorkOrderEditForm id={params.id} />
    </Layout>
  );
}
