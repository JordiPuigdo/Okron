import Layout from "components/Layout";
import { Preventive, UpdatePreventiveRequest } from "interfaces/Preventive";
import SparePart from "interfaces/SparePart";
import InspectionPoint from "interfaces/inspectionPoint";
import Machine from "interfaces/machine";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InspectionPointService from "services/inspectionPointService";
import MachineService from "services/machineService";
import PreventiveService from "services/preventiveService";
import SparePartService from "services/sparePartService";

type Props = {
  item?: Preventive;
  errors?: string;
};

const EditPreventive = ({ item, errors }: Props) => {
  const router = useRouter();
  const { id } = router.query;
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
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [date, setDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchPreventiveData = async () => {
    try {
      const preventiveData = await preventiveService.getPreventive(
        id as string
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
    setAvailableInspectionPoints(inspectionPoints);

    const selected = preventive?.inspectionPoints?.map(
      (inspectionPoints) => inspectionPoints.id
    );
    setSelectedInspectionPoints(selected ?? []);
  };

  const fetchMachine = async (preventive: Preventive) => {
    const machine = await machineService.getMachineById(preventive.machine.id);
    setMachine(machine);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchPreventiveData();
        if (data) {
          setPreventiveData(data);
          setValue("code", data.code);
          setValue("description", data.description);
          setValue("hours", data.hours);
          setValue("startExecution", data.startExecution);
          await fetchSpareParts(data);
          await fetchInspectionPoints(data);
          await fetchMachine(data);
        }
      }
    };
    fetchData();
  }, [id]);

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

  useEffect(() => {
    const parseDate = new Date(preventiveData?.startExecution!);

    // Check if the date is valid
    if (!isNaN(parseDate.getTime())) {
      const day = String(parseDate.getDate()).padStart(2, "0");
      const month = String(parseDate.getMonth() + 1).padStart(2, "0");
      const year = parseDate.getFullYear();

      const formatted = `${day}/${month}/${year}`;
      setFormattedDate(formatted);
      setDate(formatted);
    } else {
      // Handle invalid date
      setFormattedDate("Invalid date");
    }
  }, [preventiveData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setDate(inputValue);

    const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!dateRegex.test(inputValue)) {
      setError("El format de la data ha de ser: DD/MM/YYYY");
    } else {
      setError(null);
      const [day, month, year] = inputValue.split("/");
      const parsedDate = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      );
      setValue("startExecution", parsedDate);
    }
  };

  const onSubmit: SubmitHandler<Preventive> = async (data: any) => {
    try {
      const dateParts = data.startExecution.split("/");
      const jsDate = new Date(
        `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
      );

      // Convert the JavaScript Date object to an ISO string
      const isoDateString = jsDate.toISOString();
      data.startExecution = isoDateString;
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
      id: id as string,
      code: preventive.code,
      description: preventive.description,
      startExecution: preventive.startExecution,
      hours: preventive.hours,
      machineId: [machine?.id || ""],
      inspectionPointId: selectedInspectionPoints.map((point) => point),
      sparePartId: selectedSpareParts.map((sparePart) => sparePart),
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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-4 shadow-md rounded-md">
            <h1 className="text-3xl font-bold mb-4">Editar Preventiu</h1>

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
                  htmlFor="hours"
                >
                  Hores
                </label>
                <input
                  {...register("hours")}
                  id="hours"
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
                <input
                  {...register("startExecution")}
                  placeholder="dd/mm/yyyy"
                  type="text"
                  value={date}
                  onChange={handleInputChange}
                  className="form-input border border-gray-300 rounded-md w-full"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Selecciona les peces de recanvi
                </h3>
                <input
                  type="text"
                  placeholder="Filtrar per descripció"
                  value={filterSparePartsText}
                  onChange={(e) => setFilterSparePartsText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                />
                {filteredSpareParts.slice(0, 5).map((sparePart) => (
                  <div
                    key={sparePart.id}
                    className="mb-2 border p-4 rounded-md flex justify-between items-center hover:bg-gray-100"
                  >
                    <div>
                      <h4 className="text-lg font-medium text-gray-700">
                        {sparePart.code}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Stock: {sparePart.stock}
                      </p>
                    </div>
                    <button
                      disabled={selectedSpareParts.includes(sparePart.id)}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        selectedSpareParts.includes(sparePart.id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleSparePartChange(sparePart.id, true)}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-1/2 pl-4">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Peces de recanvi seleccionades
                </h3>
                {selectedSpareParts.map((selectedPart) => (
                  <div
                    key={selectedPart}
                    className="mb-2 border p-4 rounded-md flex justify-between items-center hover:bg-gray-100"
                  >
                    <div>
                      <h4 className="text-lg font-medium text-gray-700">
                        {
                          availableSpareParts.find(
                            (part) => part.id === selectedPart
                          )?.code
                        }
                      </h4>
                      <p className="text-sm text-gray-500">
                        {
                          availableSpareParts.find(
                            (part) => part.id === selectedPart
                          )?.stock
                        }
                      </p>
                    </div>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleSparePartChange(selectedPart, false)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
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
                    <div key={selectedPoint} className="mb-2">
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
            <div className="flex">Màquina assignada: {machine?.name}</div>
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
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
            >
              Cancelar
            </button>
            {showSuccessMessage && (
              <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
                Preventiu actualitzat correctament
              </div>
            )}

            {showErrorMessage && (
              <div className="bg-red-200 text-red-800 p-4 rounded mb-4">
                Error al crear preventiu
              </div>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPreventive;
