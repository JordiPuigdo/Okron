"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreatePreventiveRequest, Preventive } from "app/interfaces/Preventive";
import { useRouter } from "next/navigation";
import PreventiveService from "app/services/preventiveService";
import SparePartService from "app/services/sparePartService";
import InspectionPointService from "app/services/inspectionPointService";
import SparePart from "app/interfaces/SparePart";
import InspectionPoint from "app/interfaces/inspectionPoint";
import OperatorService from "app/services/operatorService";
import Operator from "app/interfaces/Operator";
import MachineService from "app/services/machineService";
import Machine from "app/interfaces/machine";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import { SvgSpinner } from "app/icons/icons";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";

const PreventiveForm = () => {
  const router = useRouter();
  const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [selectedSpareParts, setSelectedSpareParts] = useState<string[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>(
    []
  );
  const [availableInspectionPoints, setAvailableInspectionPoints] = useState<
    InspectionPoint[]
  >([]);
  const [aviableMachines, setAviableMachines] = useState<Machine[]>([]);
  const [selectedInspectionPoints, setSelectedInspectionPoints] = useState<
    string[]
  >([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);
  const [filterSparePartsText, setFilterSparePartsText] = useState<string>("");
  const [sparePartsLimit, setSparePartsLimit] = useState(5);
  const preventiveService = new PreventiveService(apiURL);
  const sparePartService = new SparePartService(apiURL);
  const inspectionPointService = new InspectionPointService(apiURL);
  const operatorService = new OperatorService(apiURL);
  const machineService = new MachineService(apiURL);
  const { register, handleSubmit, setValue } = useForm<Preventive>();
  const [filterText, setFilterText] = useState<string>("");
  const filteredInspectionPoints = availableInspectionPoints.filter((point) =>
    point.description.toLowerCase().includes(filterText.toLowerCase())
  );
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [date, setDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [preventiveDays, setPreventiveDays] = useState(0);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const parts = await sparePartService.getSpareParts();
        setAvailableSpareParts(parts);
        setFilteredSpareParts(parts);
      } catch (error) {
        console.error("Error fetching spare parts:", error);
      }
    };

    const fetchInspectionPoints = async () => {
      try {
        const points = await inspectionPointService.getAllInspectionPoints();
        setAvailableInspectionPoints(points.filter((x) => x.active == true));
      } catch (error) {
        console.error("Error fetching inspection points:", error);
      }
    };

    const fetchOperators = async () => {
      await operatorService.getOperators().then((workOperator) => {
        setOperators(workOperator);
      });
    };

    const fetchMachines = async () => {
      try {
        const machines = await machineService.getAllMachines();
        setAviableMachines(machines.filter((x) => x.active == true));
      } catch (error) {
        console.error("Error fetching spare parts:", error);
      }
    };

    fetchSpareParts();
    fetchInspectionPoints();
    fetchOperators();
    fetchMachines();
    let counter = 1;
    const params = new URLSearchParams(window.location.search);
    const numberPreventive = params.get("counter");
    if (numberPreventive || 0 > 0) {
      counter = 1;
    }
  }, []);

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

  function convertToCreateWorkOrderRequest(
    preventive: Preventive
  ): CreatePreventiveRequest {
    const createPreventiveRequest: CreatePreventiveRequest = {
      code: preventive.code,
      description: preventive.description,
      startExecution: startDate!,
      days: preventiveDays,
      counter: 0,
      machineId: selectedMachines.map((machine) => machine),
      inspectionPointId: selectedInspectionPoints.map((point) => point),
      sparePartId: selectedSpareParts.map((sparePart) => sparePart),
      operatorId: selectedOperator.map((operator) => operator),
    };
    return createPreventiveRequest;
  }

  const onSubmit: SubmitHandler<Preventive> = async (data) => {
    setIsLoading(true);
    try {
      if (!notValidForm(data)) {
        setIsLoading(false);
        return;
      }
      const response = await preventiveService.createPreventive(
        convertToCreateWorkOrderRequest(data)
      );

      if (response) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          history.back();
        }, 2000);
      } else {
        setTimeout(() => {
          setShowErrorMessage(false);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 2000);
    }
  };

  function notValidForm(preventive: Preventive) {
    let invalidFields = [];

    if (!preventive.code || preventive.code.trim().length === 0) {
      invalidFields.push("Code");
    }

    if (!preventive.description || preventive.description.trim().length === 0) {
      invalidFields.push("Description");
    }

    if (!startDate) {
      invalidFields.push("StartDate");
    }

    if (preventiveDays === 0) {
      invalidFields.push("PreventiveDays");
    }

    if (selectedInspectionPoints.length === 0) {
      invalidFields.push("SelectedInspectionPoints");
    }

    if (selectedOperator.length === 0) {
      invalidFields.push("SelectedOperator");
    }

    if (selectedMachines.length === 0) {
      invalidFields.push("SelectedMachines");
    }

    if (invalidFields.length > 0) {
      console.log("Invalid fields:", invalidFields);
      alert("Falten dades per assignar al preventiu");
      return false;
    }

    return true;
  }

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

  const handleCheckboxMachineChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const machineId = event.target.value;
    if (event.target.checked) {
      setSelectedMachines((prevSelected) => [...prevSelected, machineId]);
    } else {
      setSelectedMachines((prevSelected) =>
        prevSelected.filter((id) => id !== machineId)
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <MainLayout>
      <Container>
        <div className="mx-auto w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto bg-white p-8 rounded shadow-md"
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <h2 className="text-2xl font-bold mb-6 text-black">
              Configurar Preventiu
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
                  Freqüència Dies
                </label>
                <input
                  value={preventiveDays}
                  onChange={(e) => setPreventiveDays(parseInt(e.target.value))}
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
                  Primera Execució del Preventiu
                </label>
                <DatePicker
                  id="startDate"
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
                            checked={selectedInspectionPoints.includes(
                              point.id
                            )}
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
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Operaris
              </h3>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* Display list of available machines */}
              <div style={{ flex: 1 }}>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Màquines
                </h3>
                {aviableMachines.map((machine) => (
                  <div key={machine.id} className="mb-2">
                    <label
                      htmlFor={`machine-${machine.id}`}
                      className="block text-gray-600 font-medium"
                    >
                      <input
                        type="checkbox"
                        id={`machine-${machine.id}`}
                        value={machine.id}
                        onChange={handleCheckboxMachineChange}
                        checked={selectedMachines.includes(machine.id)}
                      />
                      {machine.name}
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ flex: 1 }}>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Màquines seleccionades
                </h3>
                {selectedMachines.map((selectedMachine) => (
                  <div key={selectedMachine} className="mb-2 text-black">
                    {
                      aviableMachines.find(
                        (point) => point.id === selectedMachine
                      )?.name
                    }
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
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
              } text-white font-bold py-2 px-4 rounded mt-6 flex items-center justify-center`}
            >
              Crear Preventiu
              {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
            </button>
            {showSuccessMessage && (
              <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
                Preventiu creat correctament
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
        </div>
      </Container>
    </MainLayout>
  );
};

export default PreventiveForm;
