"use client";

import { useState, useEffect } from "react";
import MachineService from "../../../services/machineService";
import Machine from "../../../interfaces/machine";
import Link from "next/link";
import Layout from "../../../components/Layout";
import { useForm, SubmitHandler } from "react-hook-form";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
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
      const machineService = new MachineService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      );
      await machineService.deleteMachine(id);
      setCreateSuccess(true);
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

  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="container mx-auto py-8">Carregant...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold mb-4">Llistat de màquines</h1>
        <button
          onClick={toggleFormVisibility}
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          {isFormVisible ? "Tancar" : "Crear una nova màquina"}
        </button>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar màquina per nom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md w-1/2 px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:border-indigo-500"
          />
        </div>
        {isFormVisible && (
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Nom"
                {...register("name", { required: true })}
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
            {errors.name && (
              <div className="text-red-600 mt-1">Has d'introduïr un nom</div>
            )}
            {errors.company && (
              <div className="text-red-600 mt-1">Has d'introduïr l'Empresa</div>
            )}
          </form>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Numero de Sèrie
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Secció
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Hores
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Any
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Activa
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Accions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMachines.map((machine) => (
              <tr key={machine.id}>
                <td className="px-6 py-4 whitespace-no-wrap">{machine.name}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {machine.company}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {machine.serialNumber}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {machine.section?.description}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  {machine.hours}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">{machine.year}</td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <label
                    className={`px-2 py-1 text-white rounded-md ${
                      machine.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {machine.active ? "Activa" : "Inactiva"}
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                  <div className="text-indigo-600 hover:underline mr-3">
                    <Link href="/machines/[id]" as={`/machines/${machine.id}`}>
                      Editar
                    </Link>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteMachine(machine.id)}
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
