"use client";
import Layout from "components/Layout";
import { Preventive } from "interfaces/Preventive";
import Link from "next/link";
import { useEffect, useState } from "react";
import PreventiveService from "services/preventiveService";

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

  useEffect(() => {
    const fetchPreventives = async () => {
      try {
        const fetchedPreventives = await preventiveService.getPreventives();
        setPreventives(fetchedPreventives);
      } catch (error) {
        console.error("Error fetching preventives:", error);
      }
    };

    fetchPreventives();
  }, []);

  const handleDelete = async (id: string) => {
    try {
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
    const preventives =
      await preventiveService.CreateWorkOrderPreventivePerDay();
    setPreventivesCreated(preventives);
    setTimeout(() => {
      setPreventivesCreated([]);
    }, 10000);
  };
  return (
    <Layout>
      <div className="container mx-auto mt-10 text-black">
        <h1 className="text-2xl font-bold mb-4">Preventius</h1>

        <Link
          href={{
            pathname: "/preventive/preventiveForm",
            query: { counter: preventives.length },
          }}
          className="text-blue-500 underline mb-2 block"
        >
          Crear
        </Link>

        <button
          onClick={generateWorkOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Generar Preventius d'avui
        </button>
        {preventivesCreated!.length > 0 ?? "Preventius creats per avui:"}
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
        {filteredPreventives.map((preventive) => (
          <div key={preventive.id} className="border p-4 my-4">
            <h2 className="text-lg font-semibold">{preventive.code}</h2>
            <p className="text-sm text-gray-600">{preventive.description}</p>
            <Link href="/preventive/[id]" as={`/preventive/${preventive.id}`}>
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
      </div>
    </Layout>
  );
}

export default PreventivePage;
