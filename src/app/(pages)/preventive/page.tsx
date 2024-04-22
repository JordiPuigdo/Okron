"use client";
import { SvgSpinner } from "app/icons/icons";
import MainLayout from "components/layout/MainLayout";
import { Preventive } from "app/interfaces/Preventive";
import Link from "next/link";
import { useEffect, useState } from "react";
import PreventiveService from "app/services/preventiveService";
import { formatDate } from "app/utils/utils";
import Container from "components/layout/Container";
import { useRouter } from "next/navigation";
import DataTable from "components/table/DataTable";
import { EntityTable } from "components/table/tableEntitys";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
} from "components/table/interfaceTable";
import WorkOrderService from "app/services/workOrderService";
import PreventiveTable from "./preventiveTable/preventiveTable";

function PreventivePage() {
  const preventiveService = new PreventiveService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [preventives, setPreventives] = useState<Preventive[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [preventivesCreated, setPreventivesCreated] = useState<
    Preventive[] | null
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [message, setMessage] = useState("");
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

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const isConfirmed = window.confirm(
        `Esteu segurs que voleu eliminar el preventiu?`
      );
      if (!isConfirmed) {
        setIsLoading(false);
        return;
      }

      await preventiveService.deletePreventive(id);

      setPreventives((prevPreventives) =>
        prevPreventives.filter((preventive) => preventive.id !== id)
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting preventive:", error);
    }
  };

  const generateWorkOrders = async () => {
    setIsLoading(true);
    const preventives =
      await preventiveService.CreateWorkOrderPreventivePerDay();
    if (preventives?.length! > 0) {
      setPreventivesCreated(preventives);
      workOrderService.cleanCache();
      setTimeout(() => {
        setPreventivesCreated([]);
      }, 10000);
    } else {
      setMessage("Avui no hi ha revisions per crear");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }

    setIsLoading(false);
  };

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
        {renderHeader()}

        <div className="flex flex-row gap-3 items-start">
          <Link
            href={{
              pathname: "/preventive/preventiveForm",
              query: { counter: preventives.length },
            }}
            className="text-white mb-2 rounded-md bg-blue-500 px-4 py-2 flex"
            onClick={(e) => setIsLoading(true)}
          >
            Crear Revisió
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </Link>

          <button
            onClick={generateWorkOrders}
            className="bg-orange-500 text-white px-4 py-2 rounded-md flex"
          >
            Generar Revisions {formatDate(new Date(), false, false)}
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
        </div>
        {message != "" && <span className="text-red-500">{message}</span>}

        <p className="text-black font-bold">
          {(preventivesCreated?.length || 0 > 0) &&
            "Revisions creades per avui:"}
        </p>
        {preventivesCreated?.map((preventive, index) => (
          <div key={index}>
            {preventive.code} - {preventive.description}
          </div>
        ))}

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
