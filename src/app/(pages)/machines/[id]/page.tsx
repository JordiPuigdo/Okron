"use client";

import { useRouter } from "next/router";
import MachineForm from "../../../../components/MachineForm";
import Machine from "../../../interfaces/machine";
import MachineService from "../../../../components/services/machineService";
import { useEffect, useState } from "react";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";

export default function EditMachinePage({
  params,
}: {
  params: { id: string };
}) {
  const fetchMachineData = async () => {
    try {
      const machineService = new MachineService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      );
      const machineData = await machineService.getMachineById(
        params.id as string
      );
      return machineData;
    } catch (error) {
      console.error("Error fetching machine data:", error);
      return null;
    }
  };

  const [machineData, setMachineData] = useState<Machine | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMachineData().then((data) => {
        if (data) {
          setMachineData(data);
        }
      });
    }
  }, [params.id]);

  function onCancel() {
    history.back();
  }

  return (
    <MainLayout>
      <Container>
        {machineData && (
          <MachineForm
            machine={machineData}
            onCancel={onCancel}
            onSubmit={function (data: Machine): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </Container>
    </MainLayout>
  );
}
