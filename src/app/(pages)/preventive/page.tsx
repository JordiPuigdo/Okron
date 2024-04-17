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

  const columns: Column[] = [
    {
      label: "ID",
      key: "id",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Codi",
      key: "code",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Descripció",
      key: "description",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Màquina",
      key: "machine.description",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Última execució",
      key: "lastExecution",
      format: ColumnFormat.DATE,
    },
  ];

  const filters: Filters[] = [
    {
      key: "code",
      label: "Codi",
      format: FiltersFormat.TEXT,
    },
    {
      key: "description",
      label: "Descripció",
      format: FiltersFormat.TEXT,
    },
    {
      key: "machine.description",
      label: "Màquina",
      format: FiltersFormat.TEXT,
    },
  ];

  const tableButtons: any = {
    edit: true,
    delete: true,
  };

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

  const filteredPreventives = preventives.filter(
    (preventive) =>
      preventive.code.toLowerCase().includes(filterText.toLowerCase()) ||
      preventive.description.toLowerCase().includes(filterText.toLowerCase())
  );

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
      setMessage("Avui no hi ha preventius per crear");
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
          Llista de preventius configurats
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
            Crear Nova Configuració de Preventiu
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </Link>

          <button
            onClick={generateWorkOrders}
            className="bg-orange-500 text-white px-4 py-2 rounded-md flex"
          >
            Generar Preventius d'Avui {formatDate(new Date(), false, false)}
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
        </div>
        {message != "" && <span className="text-red-500">{message}</span>}

        <p className="text-black font-bold">
          {(preventivesCreated?.length || 0 > 0) &&
            "Preventius creats per avui:"}
        </p>
        {preventivesCreated?.map((preventive, index) => (
          <div key={index}>
            {preventive.code} - {preventive.description}
          </div>
        ))}

        {isLoadingPage && <SvgSpinner className="flex w-full" />}
        {!isLoadingPage && (
          <DataTable
            data={filteredPreventives}
            columns={columns}
            filters={filters}
            tableButtons={tableButtons}
            entity={EntityTable.PREVENTIVE}
            onDelete={handleDelete}
          />
        )}
      </Container>
    </MainLayout>
  );
}

export default PreventivePage;
