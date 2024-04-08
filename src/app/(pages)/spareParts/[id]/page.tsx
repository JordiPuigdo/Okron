"use client";

import MainLayout from "components/layout/MainLayout";
import SparePart, {
  SparePartDetailRequest,
  SparePartDetailResponse,
  SparePartPerMachineResponse,
} from "app/interfaces/SparePart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SparePartService from "app/services/sparePartService";
import Container from "components/layout/Container";
import { formatDate, startOrEndDate, formatDateQuery } from "app/utils/utils";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import Link from "next/link";

export default function EditSparePart({ params }: { params: { id: string } }) {
  const router = useRouter();
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<SparePart>({
    defaultValues: {},
  });
  const [sparePart, setSparePart] = useState<SparePart | null>(null);
  const [sparePerMachine, setSparePartPerMachine] = useState<
    SparePartPerMachineResponse[] | null
  >([]);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 15);

  const [startDate, setStartDate] = useState<Date | null>(currentDate);
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const x: SparePartDetailRequest = {
          id: params.id,
          startDate: formatDateQuery(startDate!, true),
          endDate: formatDateQuery(endDate!, false),
        };
        const sparePartDetailResponse = await sparePartService.getSparePart(x);

        /*Object.entries(sparePart).forEach(([key, value]) => {
          const typedKey = key as keyof SparePart;
          setValue(typedKey, value[typedKey]);
        });*/
        setValue("id", sparePartDetailResponse.sparePart.id);
        setValue("code", sparePartDetailResponse.sparePart.code);
        setValue("description", sparePartDetailResponse.sparePart.description);
        setValue(
          "ubication",
          sparePartDetailResponse.sparePart.ubication != null
            ? sparePartDetailResponse.sparePart.ubication
            : ""
        );
        setValue("refProvider", sparePartDetailResponse.sparePart.refProvider);
        setValue("family", sparePartDetailResponse.sparePart.family);
        setValue(
          "brand",
          sparePartDetailResponse.sparePart.brand != null
            ? sparePartDetailResponse.sparePart.brand
            : ""
        );
        setValue("stock", sparePartDetailResponse.sparePart.stock);
        setValue("price", sparePartDetailResponse.sparePart.price);
        setValue("active", sparePartDetailResponse.sparePart.active);
        setSparePartPerMachine(
          sparePartDetailResponse.sparePartPerMachineResponse
        );
        setSparePart(sparePartDetailResponse.sparePart);
      } catch (error) {
        setShowErrorMessage(true);
      }
    };

    fetchSparePart();
  }, [params.id, setValue]);

  const onSubmit = async (sparePart: SparePart) => {
    await sparePartService
      .updateSparePart(sparePart)
      .then((spare) => {
        if (spare) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            history.back();
          }, 2000);
        }
      })
      .catch((error) => {
        setShowErrorMessage(true);
      });
  };

  async function filterSpareParts() {
    const x: SparePartDetailRequest = {
      id: params.id,
      startDate: formatDateQuery(startDate!, true),
      endDate: formatDateQuery(endDate!, false),
    };
    const sparePartDetailResponse = await sparePartService.getSparePart(x);
    setSparePartPerMachine(sparePartDetailResponse.sparePartPerMachineResponse);
  }

  function handleBack() {
    router.back();
  }
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredSpareParts = sparePerMachine!.filter((sparePartPerMachine) => {
    return (
      sparePartPerMachine.machine.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sparePartPerMachine.spareParts.some((consumes) =>
        consumes.operator.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });
  const totalUnitsPerMachine = filteredSpareParts?.map((sparePartPerMachine) =>
    sparePartPerMachine.spareParts.reduce(
      (total, consumes) => total + consumes.quantity,
      0
    )
  );

  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row mb-6">
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
          {sparePart?.code} - {sparePart?.description}
        </h2>
      </div>
    );
  };
  if (!sparePart) return <>Carregant dades</>;
  if (sparePart)
    return (
      <MainLayout>
        <Container>
          {renderHeader()}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Codi
              </label>
              <input
                {...register("code")}
                id="code"
                type="text"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Descripció
              </label>
              <input
                {...register("description")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ubicació
              </label>
              <input
                {...register("ubication")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ref Proveïdor
              </label>
              <input
                {...register("refProvider")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Família
              </label>
              <input
                {...register("family")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Preu
              </label>
              <input
                {...register("price")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Stock
              </label>
              <input
                {...register("stock")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Actiu
              </label>
              <input
                {...register("active")}
                type="checkbox"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Guardar
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 text-white ml-4 px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
            >
              Cancelar
            </button>

            {showSuccessMessage && (
              <p className="mt-4 text-green-600">
                Recanvi actualitzat correctament!
              </p>
            )}
            {showErrorMessage && (
              <p className="mt-4 text-red-600">
                Error actualitzant el recanvi.
              </p>
            )}
          </form>
          <div className="overflow-x-auto mt-4 bg-gray-400 p-4 rounded-lg mb-6">
            <div className="mb-4 text-white text-lg font-semibold">
              Unitats consumides
            </div>
            <div className="flex items-center space-x-4 pb-4">
              <span className="text-white pr-3">Data Inici:</span>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={ca}
                className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
              />
              <span className="text-white pr-3">Data Fi:</span>
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={(date: Date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={ca}
                className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
              />
              <button
                type="button"
                onClick={filterSpareParts}
                className="bg-blue-500 text-white ml-4 px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 "
              >
                Filtrar per dates
              </button>
              <input
                type="text"
                placeholder="Màquina / Operari"
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
              />
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Màquina
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Unitats
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dia
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Operari
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detall Ordre
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSpareParts?.map((sparePartPerMachine, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {sparePartPerMachine.machine.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePartPerMachine.spareParts.map((consumes, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {consumes.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePartPerMachine.spareParts.map((consumes, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {formatDate(consumes.creationDate, true)}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePartPerMachine.spareParts.map((consumes, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          {consumes.operator.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePartPerMachine.workOrderId.length > 0 && (
                        <Link
                          href="/workOrders/[id]"
                          as={`/workOrders/${sparePartPerMachine.workOrderId}`}
                          className="flex bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                        >
                          Detall
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">
                      Total Unitats Consumides
                    </div>
                  </td>
                  <td
                    colSpan={4}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold"
                  >
                    {totalUnitsPerMachine?.reduce(
                      (total, units) => total + units,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </MainLayout>
    );
}
