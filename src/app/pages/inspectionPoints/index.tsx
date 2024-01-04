import { useState, useEffect, useCallback } from "react";
import InspectionPointService from "../../../services/inspectionPointService"; // Import your InspectionPointService
import InspectionPoint from "../../../interfaces/inspectionPoint"; // Import your InspectionPoint interface
import Layout from "../../../components/Layout";

export default function InspectionPointsPage() {
  const [inspectionPoints, setInspectionPoints] = useState<InspectionPoint[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };
  const [filterActive, setFilterActive] = useState(true);
  const [filterText, setFilterText] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const inspectionPointService = new InspectionPointService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      ); // Replace with your API base URL
      const newInspectionPoint =
        await inspectionPointService.createInspectionPoint({
          description: newDescription,
          id: "",
          active: true,
        });
      fetchInspectionPoints();

      setNewDescription("");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating inspection point:", error);
    }
  };

  useEffect(() => {
    fetchInspectionPoints();
  }, []);

  async function fetchInspectionPoints() {
    try {
      const inspectionPointService = new InspectionPointService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      ); // Replace with your API base URL
      const inspectionPointsData =
        await inspectionPointService.getAllInspectionPoints();
      setInspectionPoints(inspectionPointsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inspection points:", error);
      setIsLoading(false);
    }
  }

  const handleEditDescription = useCallback(
    async (id: string, description: string) => {
      try {
        const newDescription = prompt("Edita la descripció", description);
        if (newDescription === null) {
          return; // User cancelled the edit
        }

        const inspectionPointService = new InspectionPointService(
          process.env.NEXT_PUBLIC_API_BASE_URL || ""
        ); // Replace with your API base URL
        await inspectionPointService.updateInspectionPoint(id, {
          description: newDescription,
          id: id,
          active: true,
        });

        setInspectionPoints((prevInspectionPoints) =>
          prevInspectionPoints.map((inspectionPoint) =>
            inspectionPoint.id === id
              ? { ...inspectionPoint, description: newDescription }
              : inspectionPoint
          )
        );
      } catch (error) {
        console.error("Error updating inspection point description:", error);
      }
    },
    []
  );

  async function handleDeleteInspectionPoint(id: string) {
    try {
      const inspectionPointService = new InspectionPointService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      ); // Replace with your API base URL
      await inspectionPointService.deleteInspectionPoint(id);
      fetchInspectionPoints();
    } catch (error) {
      console.error("Error deleting inspection point:", error);
    }
  }

  const filteredInspectionPoints = inspectionPoints
    .filter((point) => (filterActive ? point.active : true))
    .filter((point) =>
      point.description.toLowerCase().includes(filterText.toLowerCase())
    );

  if (isLoading) {
    return <div className="container mx-auto py-8">Carregant...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold mb-4">
          Llista de punts d'inspecció
        </h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={toggleFormVisibility}
        >
          {isFormVisible ? "Cancelar" : "Crear nou punt d'inspecció"}
        </button>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar per codi o descripció"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 flex-1"
          />
        </div>
        <label>
          Veure punts d'inspecció actius
          <input
            type="checkbox"
            checked={filterActive}
            onChange={() => setFilterActive(!filterActive)}
            className="ml-2"
          />
        </label>
        {isFormVisible && (
          <form onSubmit={handleFormSubmit} className="mb-4">
            <input
              type="text"
              placeholder="Escriu la descripció"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border rounded py-2 px-3"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-2 rounded"
            >
              Crear
            </button>
          </form>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Descripció
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Accions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInspectionPoints.map((inspectionPoint) => (
              <tr key={inspectionPoint?.id}>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <span
                    className="cursor-pointer underline text-indigo-600"
                    onClick={() =>
                      handleEditDescription(
                        inspectionPoint.id,
                        inspectionPoint.description
                      )
                    }
                  >
                    {inspectionPoint?.description} {inspectionPoint?.active}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() =>
                      handleDeleteInspectionPoint(inspectionPoint.id)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
