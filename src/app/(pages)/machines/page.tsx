"use client";

import { useState, useEffect } from "react";
import MachineService from "app/services/machineService";
import Machine from "../../interfaces/machine";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import { useRouter } from "next/navigation";
import Section from "app/interfaces/Section";
import SectionService from "app/services/sectionService";
import DataTable from "components/table/DataTable";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interface/interfaceTable";
import { EntityTable } from "components/table/interface/tableEntitys";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sections, SetSections] = useState<Section[]>([]);
  const sectionService = new SectionService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Machine>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const [filterActive, setFilterActive] = useState(true);
  const [selectedSection, setSelectedSection] = useState("");
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      label: "Secció",
      key: "section.description",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Numero de Sèrie",
      key: "serialNumber",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Empresa",
      key: "company",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Activa",
      key: "active",
      format: ColumnFormat.BOOLEAN,
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
      key: "section.description",
      label: "Secció",
      format: FiltersFormat.TEXT,
    },
  ];

  const tableButtons: TableButtons = {
    edit: true,
    delete: true,
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    async function fetchMachines() {
      try {
        const machineService = new MachineService(
          process.env.NEXT_PUBLIC_API_BASE_URL || ""
        );
        const machinesData = await machineService.getAllMachines();
        setMachines(machinesData);
        const response = await sectionService.getSections();
        SetSections(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching machines:", error);
        setIsLoading(false);
      }
    }

    fetchMachines();
  }, [createSuccess]);

  async function handleDeleteMachine(id: string) {
    try {
      const isConfirmed = window.confirm(
        "Segur que voleu eliminar la màquina?"
      );
      if (isConfirmed) {
        const machineService = new MachineService(
          process.env.NEXT_PUBLIC_API_BASE_URL || ""
        );
        await machineService.deleteMachine(id);
        setCreateSuccess(true);
      }
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  }

  const onSubmit: SubmitHandler<Machine> = async (data) => {
    try {
      setIsSubmitting(true);
      const machineService = new MachineService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      );
      await machineService.createMachine(data);
      toggleFormVisibility();
      setCreateSuccess(true);
    } catch (error) {
      console.error("Error creating machine:", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Carregant...</div>;
  }

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
          Llista de màquines
        </h2>
      </div>
    );
  };
  return (
    <MainLayout>
      <Container>
        {renderHeader()}
        <button
          onClick={toggleFormVisibility}
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 mb-4"
        >
          {isFormVisible ? "Tancar" : "Crear una nova màquina"}
        </button>

        {isFormVisible && (
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Nom"
                {...register("description", { required: true })}
                className="border rounded-md w-1/2 px-3 py-2 mt-1 mr-2 text-gray-700 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Empresa"
                {...register("company", { required: true })}
                className="border rounded-md w-1/2 px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                {isSubmitting ? "Creant..." : "Crear Màquina"}
              </button>
            </div>
            {errors.description && (
              <div className="text-red-600 mt-1">Has d'introduïr un nom</div>
            )}
            {errors.company && (
              <div className="text-red-600 mt-1">Has d'introduïr l'Empresa</div>
            )}
          </form>
        )}
        <DataTable
          columns={columns}
          data={machines}
          tableButtons={tableButtons}
          entity={EntityTable.MACHINE}
          filters={filters}
          onDelete={handleDeleteMachine}
        />
      </Container>
    </MainLayout>
  );
}
