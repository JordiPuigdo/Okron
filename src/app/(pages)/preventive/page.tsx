"use client";
import { useEffect, useState } from "react";
import { SvgSpinner } from "app/icons/icons";
import { Preventive } from "app/interfaces/Preventive";
import PreventiveService from "app/services/preventiveService";
import Container from "components/layout/Container";
import MainLayout from "components/layout/MainLayout";
import { Button } from "designSystem/Button/Buttons";
import { useRouter } from "next/navigation";

import GeneratePreventive from "./components/GeneratePreventive";
import PreventiveTable from "./preventiveTable/preventiveTable";

function PreventivePage() {
  const preventiveService = new PreventiveService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );

  const [preventives, setPreventives] = useState<Preventive[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPreventives = async () => {
      try {
        const fetchedPreventives = await preventiveService.getPreventives();
        setPreventives(fetchedPreventives);
      } catch (error) {
        setIsLoadingPage(false);
        console.error("Error fetching preventives:", error);
      }
      setIsLoadingPage(false);
    };

    fetchPreventives();
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row mb-8">
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
          Llista de revisions configurades
        </h2>
      </div>
    );
  };

  return (
    <MainLayout>
      <Container>
        <div className="p-2">
          <p>
            Menu {">"} Revisions {">"} Configuració
          </p>
        </div>
        <div className="flex flex-row gap-3 items-start mt-2">
          <Button
            type="create"
            href={`/preventive/preventiveForm`}
            onClick={() => setIsLoading(true)}
            customStyles="flex gap-2"
          >
            Crear Revisió
            {isLoading && <SvgSpinner className="w-6 h-6" />}
          </Button>
          <GeneratePreventive />
        </div>

        {isLoadingPage && <SvgSpinner className="flex w-full" />}
        {!isLoadingPage && (
          <PreventiveTable
            enableFilters={true}
            enableDelete={true}
            enableEdit={true}
          />
        )}
      </Container>
    </MainLayout>
  );
}

export default PreventivePage;
