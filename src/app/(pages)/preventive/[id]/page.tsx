"use client";

import Operator from "app/interfaces/Operator";
import { Preventive, UpdatePreventiveRequest } from "app/interfaces/Preventive";
import SparePart from "app/interfaces/SparePart";
import InspectionPoint from "app/interfaces/inspectionPoint";
import Machine from "app/interfaces/machine";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InspectionPointService from "components/services/inspectionPointService";
import MachineService from "components/services/machineService";
import OperatorService from "components/services/operatorService";
import PreventiveService from "components/services/preventiveService";
import SparePartService from "components/services/sparePartService";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";

export default function EditPreventive({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [preventiveData, setPreventiveData] = useState<Preventive | null>(null);
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const machineService = new MachineService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [machine, setMachine] = useState<Machine | null>(null);
  const { register, handleSubmit, setValue } = useForm<Preventive>();
  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>(
    []
  );
  const [selectedSpareParts, setSelectedSpareParts] = useState<string[]>([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string[]>([]);
  const [filterSparePartsText, setFilterSparePartsText] = useState<string>("");
  const [selectedInspectionPoints, setSelectedInspectionPoints] = useState<
    string[]
  >([]);
  const [filterText, setFilterText] = useState<string>("");
  const [availableInspectionPoints, setAvailableInspectionPoints] = useState<
    InspectionPoint[]
  >([]);
  const filteredInspectionPoints = availableInspectionPoints.filter((point) =>
    point.description.toLowerCase().includes(filterText.toLowerCase())
  );
  const inspectionPointService = new InspectionPointService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const preventiveService = new PreventiveService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const fetchPreventiveData = async () => {
    try {
      const preventiveData = await preventiveService.getPreventive(
        params.id as string
      );
      return preventiveData;
    } catch (error) {
      console.error("Error fetching machine data:", error);
      return null;
    }
  };

  const fetchSpareParts = async (preventive: Preventive) => {
    const spareParts = await sparePartService.getSpareParts();
    setAvailableSpareParts(spareParts);
    setFilteredSpareParts(spareParts);
    const selectedSparePartIds = preventive?.spareParts?.map(
      (sparePart) => sparePart.id
    );
    setSelectedSpareParts(selectedSparePartIds ?? []);
  };

  const fetchInspectionPoints = async (preventive: Preventive) => {
    const inspectionPoints =
      await inspectionPointService.getAllInspectionPoints();
    setAvailableInspectionPoints(
      inspectionPoints.filter((x) => x.active == true)
    );

    const selected = preventive?.inspectionPoints?.map(
      (inspectionPoints) => inspectionPoints.id
    );
    setSelectedInspectionPoints(selected ?? []);
  };

  const fetchMachine = async (preventive: Preventive) => {
    const machine = await machineService.getMachineById(preventive.machine.id);
    setMachine(machine);
  };

  const fetchOperators = async (preventive: Preventive) => {
    await operatorService.getOperators().then((workOperator) => {
      setOperators(workOperator);
      const selected = preventive?.operators?.map((operators) => operators.id);
      setSelectedOperator(selected ?? []);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        const data = await fetchPreventiveData();
        if (data) {
          setPreventiveData(data);
          setValue("code", data.code);
          setValue("description", data.description);
          setValue("hours", data.hours);
          setValue("days", data.days);
          setValue("startExecution", data.startExecution);
          const finalData = new Date(data.startExecution);
          setStartDate(finalData);
          await fetchSpareParts(data);
          await fetchInspectionPoints(data);
          await fetchMachine(data);
          await fetchOperators(data);
        }
      }
    };
    fetchData();
  }, [params.id]);

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    const filtered = availableSpareParts.filter((sparePart) => {
      const searchText = filterSparePartsText.toLowerCase();

      return [
        sparePart.code,
        sparePart.description,
        sparePart.refProvider,
        sparePart.family,
      ].some((field) => field && field.toLowerCase().includes(searchText));
    });

    setFilteredSpareParts(filtered);
  }, [filterSparePartsText]);

  const onSubmit: SubmitHandler<Preventive> = async (data: any) => {
    try {
      const response = await preventiveService.updatePreventive(
        convertToUpdateWorkOrderRequest(data)
      );

      if (response) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          history.back();
        }, 2000);
      } else {
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 2000);
      }
    } catch (error) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 2000);
    }
  };

  function convertToUpdateWorkOrderRequest(
    preventive: Preventive
  ): UpdatePreventiveRequest {
    const updatePreventiveRequest: UpdatePreventiveRequest = {
      id: params.id as string,
      code: preventive.code,
      description: preventive.description,
      startExecution: startDate!,
      days: preventive.days,
      counter: preventive.counter,
      machineId: [machine?.id || ""],
      inspectionPointId: selectedInspectionPoints.map((point) => point),
      sparePartId: selectedSpareParts.map((sparePart) => sparePart),
      operatorId: selectedSpareParts.map((sparePart) => sparePart),
    };
    return updatePreventiveRequest;
  }

  const handleSparePartChange = (id: string, isChecked: boolean) => {
    setSelectedSpareParts((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pointId = event.target.value;
    if (event.target.checked) {
      setSelectedInspectionPoints((prevSelected) => [...prevSelected, pointId]);
    } else {
      setSelectedInspectionPoints((prevSelected) =>
        prevSelected.filter((id) => id !== pointId)
      );
    }
  };

  const handleCheckboxOperatorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const operator = event.target.value;
    if (event.target.checked) {
      setSelectedOperator((prevSelected) => [...prevSelected, operator]);
    } else {
      setSelectedOperator((prevSelected) =>
        prevSelected.filter((id) => id !== operator)
      );
    }
  };

  return (
    <MainLayout>
      <Container>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto bg-white p-8 rounded shadow-md"
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-black">
            Editar Preventiu
          </h2>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ flex: "1" }}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="code"
              >
                Codi
              </label>
              <input
                {...register("code")}
                id="code"
                type="text"
                className="form-input border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Descripció
              </label>
              <textarea
                {...register("description")}
                id="description"
                className="form-textarea border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="days"
              >
                Dies
              </label>
              <input
                {...register("days")}
                id="days"
                type="number"
                className="form-input border border-gray-300 rounded-md w-full"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startExecution"
              >
                Inici Preventiu
              </label>
              <DatePicker
                id="startExecution"
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={ca}
                className="border border-gray-300 p-2 rounded-md mr-4"
              />

              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>
          <div style={{ display: "flex", flex: "1" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Selecciona els punts d'inspecció
                </h3>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Filtrar per descripció"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />

                  {filteredInspectionPoints.map((point) => (
                    <div key={point.id} className="mb-2">
                      <label
                        htmlFor={`inspectionPoint-${point.id}`}
                        className="block text-gray-600 font-medium"
                      >
                        <input
                          type="checkbox"
                          id={`inspectionPoint-${point.id}`}
                          value={point.id}
                          onChange={handleCheckboxChange}
                          checked={selectedInspectionPoints.includes(point.id)}
                        />
                        {point.description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Punts d'inspecció seleccionats
                </h3>

                {selectedInspectionPoints.map((selectedPoint) => (
                  <div key={selectedPoint} className="mb-2 text-black">
                    {
                      availableInspectionPoints.find(
                        (point) => point.id === selectedPoint
                      )?.description
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4 mt-4 text-black">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Operaris</h3>

            {operators.map((worker) => (
              <div key={worker.id} className="mb-2">
                <label
                  htmlFor={`operator-${worker.id}`}
                  className="block text-gray-600 font-medium"
                >
                  <input
                    type="checkbox"
                    id={`operator-${worker.id}`}
                    value={worker.id}
                    onChange={handleCheckboxOperatorChange}
                    checked={selectedOperator.includes(worker.id)}
                  />
                  {worker.name}
                </label>
              </div>
            ))}
          </div>
          <div className="flex text-black">
            Màquina assignada: {machine?.name}
          </div>
          <button
            type="submit"
            className={`${
              showSuccessMessage
                ? "bg-green-500"
                : showErrorMessage
                ? "bg-red-500"
                : "bg-blue-500"
            } hover:${
              showSuccessMessage
                ? "bg-green-700"
                : showErrorMessage
                ? "bg-red-700"
                : "bg-blue-700"
            } text-white font-bold py-2 px-4 rounded mt-6`}
          >
            Actualitzar Preventiu
          </button>
          {showSuccessMessage && (
            <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
              Preventiu actualitzat correctament
            </div>
          )}

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
          >
            Cancelar
          </button>

          {showErrorMessage && (
            <div className="bg-red-200 text-red-800 p-4 rounded mb-4">
              Error al crear preventiu
            </div>
          )}
        </form>
      </Container>
    </MainLayout>
  );
}
