"use client";

import WorkOrder, { CreateWorkOrderRequest } from "app/interfaces/workOrder";
import Machine from "app/interfaces/machine";
import WorkOrderService from "app/services/workOrderService";
import WorkOrderEditForm from "./components/workOrderEditForm";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";

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
    <MainLayout>
      <Container>
        <WorkOrderEditForm id={params.id} />
      </Container>
    </MainLayout>
  );
}
