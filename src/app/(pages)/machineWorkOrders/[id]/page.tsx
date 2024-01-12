"use client";

import Layout from "components/Layout";
import WorkOrderForm from "./WorkOrderForm";
import { CreateWorkOrderRequest } from "interfaces/workOrder";
import Machine from "interfaces/machine";

export default function EditWorkOrder({ params }: { params: { id: string } }) {
  const handleWorkOrderSubmit = async (
    updateWorkOrderRequest: CreateWorkOrderRequest,
    machine: Machine | null
  ) => {
    try {
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
      <WorkOrderForm
        onSubmit={(WorkOrderRequest) =>
          handleWorkOrderSubmit(WorkOrderRequest, null)
        }
        machineName=""
        id={params.id}
      />
    </Layout>
  );
}
