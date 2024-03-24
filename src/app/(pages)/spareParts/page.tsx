"use client";

import MainLayout from "components/layout/MainLayout";
import SparePart from "app/interfaces/SparePart";
import Link from "next/link";
import { useEffect, useState } from "react";
import SparePartService from "app/services/sparePartService";
import Container from "components/layout/Container";
import { useSessionStore } from "app/stores/globalStore";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

function SparePartsPage() {
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);
  const [filters, setFilters] = useState({
    code: "",
    description: "",
    refProvider: "",
    family: "",
    ubication: "",
  });
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [finalIndex, setFinalIndex] = useState(1);
  const { loginUser } = useSessionStore((state) => state);

  useEffect(() => {
    async function fetchOperators() {
      try {
        const data = await sparePartService.getSpareParts();
        setSpareParts(data);
        setFilteredSpareParts(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOperators();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filtered = spareParts.filter((sparePart) => {
      return (
        (!filters.code ||
          sparePart.code?.toLowerCase().includes(filters.code.toLowerCase())) &&
        (!filters.description ||
          sparePart.description
            ?.toLowerCase()
            .includes(filters.description.toLowerCase())) &&
        (!filters.refProvider ||
          sparePart.refProvider
            ?.toLowerCase()
            .includes(filters.refProvider.toLowerCase())) &&
        (!filters.family ||
          sparePart.family
            ?.toLowerCase()
            .includes(filters.family.toLowerCase())) &&
        (!filters.ubication ||
          sparePart.ubication
            ?.toLowerCase()
            .includes(filters.ubication.toLowerCase()))
      );
    });
    setFinalIndex(filtered.length);
    setFilteredSpareParts(filtered.slice(startIndex, endIndex));
  }, [filters, spareParts, currentPage, itemsPerPage]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <Container>
        <h1 className="text-2xl font-bold mb-4">Recanvis</h1>

        {loading ? (
          <p>Carregant dades...</p>
        ) : (
          <>
            {loginUser != undefined && loginUser?.permission > 0 && (
              <div className="mb-4">
                {" "}
                <Link
                  href="/spareParts/sparePartForm"
                  as={`/spareParts/sparePartForm`}
                  className="bg-blue-500 text-white px-3 py-1 ml-2 rounded-md "
                >
                  Crear
                </Link>
              </div>
            )}
            <div className="mb-4 flex space-x-4 text-black">
              <input
                type="text"
                placeholder="Codi"
                value={filters.code}
                onChange={(e) => handleFilterChange("code", e.target.value)}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Descripció"
                value={filters.description}
                onChange={(e) =>
                  handleFilterChange("description", e.target.value)
                }
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Referència"
                value={filters.refProvider}
                onChange={(e) =>
                  handleFilterChange("refProvider", e.target.value)
                }
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Família"
                value={filters.family}
                onChange={(e) => handleFilterChange("family", e.target.value)}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Ubicació"
                value={filters.ubication}
                onChange={(e) =>
                  handleFilterChange("ubication", e.target.value)
                }
                className="border p-2"
              />
            </div>

            <div className="mb-4 flex items-center space-x-4">
              <span>Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="border p-2 text-black"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>recanvis per pàgina</span>
            </div>

            <table className="min-w-full bg-white border border-gray-300 text-black">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Codi</th>
                  <th className="py-2 px-4 border-b">Descripció</th>
                  <th className="py-2 px-4 border-b">Ubicació</th>
                  <th className="py-2 px-4 border-b">Referència</th>
                  <th className="py-2 px-4 border-b">Familia</th>
                  <th className="py-2 px-4 border-b">Stock</th>
                  {loginUser != undefined && loginUser?.permission > 0 && (
                    <th className="py-2 px-4 border-b">Accions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredSpareParts.map((sparePart) => (
                  <tr key={sparePart.id}>
                    <td className="py-2 px-4 border-b">{sparePart.code}</td>
                    <td className="py-2 px-4 border-b">
                      {sparePart.description}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {sparePart.ubication}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {sparePart.refProvider}
                    </td>
                    <td className="py-2 px-4 border-b">{sparePart.family}</td>
                    <td className="py-2 px-4 border-b">{sparePart.stock}</td>
                    {loginUser != undefined && loginUser?.permission > 0 && (
                      <td>
                        <Link
                          href="/spareParts/[id]"
                          as={`/spareParts/${sparePart.id}`}
                          className="bg-green-500 text-white px-3 py-1 ml-2 rounded-md "
                        >
                          Editar
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center items-center mt-6 pb-6">
              <span className="mr-4">
                Pàgina {currentPage} de {""}
                {Math.ceil(finalIndex / itemsPerPage)}
              </span>
              <div className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Anterior
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * itemsPerPage >= finalIndex}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Següent
                </button>
              </div>
            </div>
          </>
        )}
      </Container>
    </MainLayout>
  );
}

export default SparePartsPage;
