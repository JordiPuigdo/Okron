"use client";

import { useState, useEffect, useCallback } from "react";
import InspectionPointService from "app/services/inspectionPointService";
import InspectionPoint from "../../interfaces/inspectionPoint";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interfaceTable";
import DataTable from "components/table/DataTable";
import { EntityTable } from "components/table/tableEntitys";

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

  const columns: Column[] = [
    {
      label: "ID",
      key: "id",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Descripció",
      key: "description",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Actiu",
      key: "active",
      format: ColumnFormat.BOOLEAN,
    },
  ];

  const filters: Filters[] = [
    {
      key: "description",
      label: "Descripció",
      format: FiltersFormat.TEXT,
    },
  ];

  const tableButtons: TableButtons = {
    edit: true,
    delete: true,
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const inspectionPointService = new InspectionPointService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      );
      const newInspectionPoint =
        await inspectionPointService.createInspectionPoint({
          description: newDescription,
          id: "",
          active: true,
        });
      fetchInspectionPoints();

      setNewDescription("");
      setIsFormVisible(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
      );
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
          return;
        }

        const inspectionPointService = new InspectionPointService(
          process.env.NEXT_PUBLIC_API_BASE_URL || ""
        );
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
      const isConfirmed = window.confirm(
        "Segur que voleu eliminar aquest punt d'inspecció?"
      );
      if (isConfirmed) {
        const inspectionPointService = new InspectionPointService(
          process.env.NEXT_PUBLIC_API_BASE_URL || ""
        );
        await inspectionPointService.deleteInspectionPoint(id);
        setInspectionPoints((prevInspectionPoints) =>
          prevInspectionPoints.filter(
            (inspectionPoint) => inspectionPoint.id !== id
          )
        );
        fetchInspectionPoints();
      }
    } catch (error) {
      console.error("Error deleting inspection point:", error);
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Carregant...</div>;
  }

  return (
    <MainLayout>
      <Container>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={toggleFormVisibility}
        >
          {isFormVisible ? "Cancelar" : "Crear nou punt d'inspecció"}
        </button>
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
        <DataTable
          data={inspectionPoints}
          columns={columns}
          filters={filters}
          tableButtons={tableButtons}
          entity={EntityTable.INSPECTIONPOINTS}
          onDelete={handleDeleteInspectionPoint}
        />
      </Container>
    </MainLayout>
  );
}
