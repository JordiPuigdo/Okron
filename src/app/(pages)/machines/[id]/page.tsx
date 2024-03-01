"use client";

import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row mb-6">
        <div
          className="cursor-pointer mb-4 sm:mb-0"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 inline-block mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-black mx-auto">
          Configurar màquina
        </h2>
      </div>
    );
  };
  return (
    <MainLayout>
      <Container>
        {renderHeader()}
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
