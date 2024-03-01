"use client";
import { SvgSpinner } from "app/icons/icons";
import MainLayout from "components/layout/MainLayout";
import { Preventive } from "app/interfaces/Preventive";
import Link from "next/link";
import { useEffect, useState } from "react";
import PreventiveService from "components/services/preventiveService";
import { formatDate } from "app/utils/utils";
import Container from "components/layout/Container";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

function PreventivePage() {
  const preventiveService = new PreventiveService(
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
      const isConfirmed = window.confirm(
        `Esteu segurs que voleu eliminar el preventiu?`
      );
      if (!isConfirmed) return;

      await preventiveService.deletePreventive(id);

      setPreventives((prevPreventives) =>
        prevPreventives.filter((preventive) => preventive.id !== id)
      );
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
            Generar Preventius d'Avui {formatDate(new Date(), false)}
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
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar per codi o descripció"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 flex-1"
          />
        </div>
        {isLoadingPage && <SvgSpinner className="flex w-full" />}
        {!isLoadingPage &&
          filteredPreventives.map((preventive) => (
            <div key={preventive.id} className="border p-4 my-4">
              <h2 className="text-lg font-semibold">{preventive.code}</h2>
              <p className="text-sm text-gray-600">{preventive.description}</p>
              <p className="text-sm text-gray-600">{preventive.machine.name}</p>
              <Link
                href="/preventive/[id]"
                as={`/preventive/${preventive.id}`}
                className="bg-green-500 text-white px-3 py-1 ml-2 rounded-md "
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(preventive.id)}
                className="bg-red-500 text-white px-3 py-1 ml-2 rounded-md cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          ))}
      </Container>
    </MainLayout>
  );
}

export default PreventivePage;
