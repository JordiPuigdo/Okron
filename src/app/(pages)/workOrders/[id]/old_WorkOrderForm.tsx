"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import WorkOrder, {
  CreateWorkOrderRequest,
  StateWorkOrder,
} from "../../../../interfaces/workOrder";
import InspectionPoint from "interfaces/inspectionPoint";
import InspectionPointService from "services/inspectionPointService";
import OperatorService from "services/operatorService";
import Operator from "interfaces/Operator";
import SparePartService from "services/sparePartService";
import SparePart, { ConsumeSparePart } from "interfaces/SparePart";
import WorkOrderService from "services/workOrderService";
import { stringifyCookie } from "next/dist/compiled/@edge-runtime/cookies";

type WorkOrderFormProps = {
  WorkOrder?: CreateWorkOrderRequest;
  onSubmit: SubmitHandler<CreateWorkOrderRequest>;
  machineName: string;
  WorkOrderCreated?: WorkOrder;
  id: string;
};

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  WorkOrder,
  onSubmit,
  machineName,
  id,
}) => {
  const { register, handleSubmit, setValue } = useForm<WorkOrder>({
    defaultValues: WorkOrder,
  });
  const inspectionPointService = new InspectionPointService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>(
    []
  );
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);
  const [date, setDate] = useState<string>("");
  const [selectedSpareParts, setSelectedSpareParts] = useState<string[]>([]);
  const [filterSparePartsText, setFilterSparePartsText] = useState<string>("");
  const [showMoreSpareParts, setShowMoreSpareParts] = useState(false);
  const [sparePartsLimit, setSparePartsLimit] = useState(5);

  const handleShowMoreSpareParts = () => {
    setShowMoreSpareParts(true);
    setSparePartsLimit((prevLimit) => prevLimit + 10);
  };

  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [availableInspectionPoints, setAvailableInspectionPoints] = useState<
    InspectionPoint[]
  >([]);
  const [selectedInspectionPoints, setSelectedInspectionPoints] = useState<
    string[]
  >([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string[]>([]);
  const [selectedWorkersIds, setSelectedWorkersIds] = useState<string[]>([]);
  const [selectSparePartsIds, setSelectedSparePartsIds] = useState<string[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const stateWorkOrderStrings: Record<StateWorkOrder, string> = {
    [StateWorkOrder.Waiting]: "En Espera",
    [StateWorkOrder.OnGoing]: "En Curs",
    [StateWorkOrder.Paused]: "Pausada",
    [StateWorkOrder.Finished]: "Acabada",
  };
  const filteredInspectionPoints = availableInspectionPoints.filter((point) =>
    point.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const [unitsPerSparePart, setUnitsPerSparePart] = useState<{
    [key: string]: number;
  }>({});

  const [workOrderSelected, setWorkOrderSelected] = useState<
    WorkOrder | undefined
  >(undefined);

  useEffect(() => {
    const fetchWorkOrderById = async () => {
      try {
        if (id != undefined) {
          await workOrderService
            .getWorkOrderById(id)
            .then((workOrderData) => {
              setWorkOrderSelected(workOrderData);
              setValue("code", workOrderData!.code);
              setValue("description", workOrderData!.description);
              setValue("startTime", workOrderData!.startTime);
              setValue("stateWorkOrder", workOrderData!.stateWorkOrder);

              const selectedInspectionPoints =
                workOrderData!.workOrderInspectionPoint?.map(
                  (point) => point.inspectionPointId
                );
              //   setSelectedInspectionPoints(selectedInspectionPoints);

              /* const selectedSpareParts = workOrderData!.spareParts.map(
                (sparePart) => sparePart.id
              );*/
              setSelectedSpareParts(selectedSpareParts);

              /*  const selectedOperators = workOrderData.operators.map(
                (operator) => operator.id
              );*/
              //setSelectedOperator(selectedOperators);
            })
            .catch((error) => {
              console.error("Error loading WorkOrder:", error);
            });
        }
      } catch (error) {
        console.error("Error fetching work order:", error);
        // Handle error fetching work order, e.g., show an error message
      }
    };

    if (id) {
      fetchWorkOrderById();
    }
  }, [id]);

  const handleAddPoints = () => {
    console.log("Selected Inspection Points:", selectedInspectionPoints);
  };

  const handleFormSubmit = (data: WorkOrder) => {
    const selectedPointsWithData = selectedInspectionPoints.map((pointId) => {
      const point = availableInspectionPoints.find(
        (point) => point.id === pointId
      );
      return {
        id: pointId,
        description: point?.description || "",
        check: false,
      };
    });

    const selectedWorkersWithData = selectedOperator.map((operatorId) => {
      const operator = operators.find((operator) => operator.id === operatorId);
      return {
        id: operator?.id,
      };
    });

    setSelectedWorkersIds(
      selectedWorkersWithData
        .filter((worker) => worker.id !== undefined)
        .map((worker) => worker.id as string)
    );

    const selectedSparePartsData = selectedSpareParts.map((sparePartId) => {
      const sparePart = availableSpareParts.find(
        (part) => part.id === sparePartId
      );
      return {
        id: sparePart?.id || "",
        code: sparePart?.code || "",
        description: sparePart?.description || "",
        refProvideer: sparePart?.refProvider || "",
        family: sparePart?.family || "",
        stock: sparePart?.stock || 0,
      };
    });

    const selectedSparePartsArray: SparePart[] = selectedSparePartsData.map(
      (sparePartData, index) => ({
        id: sparePartData.id,
        code: sparePartData.code,
        description: sparePartData.description,
        refProvider: sparePartData.refProvideer,
        family: sparePartData.family,
        stock: sparePartData.stock,
        brand: "",
        ubication: "",
      })
    );
    //data.workOrderInspectionPoint = selectedPointsWithData;
    data.operatorId = selectedWorkersIds;
    /*if (selectedSparePartsData) {
      data.sparePart = selectedSparePartsArray;
    }*/

    const finalData = convertToCreateWorkOrderRequest(data);

    onSubmit(finalData);
  };

  function convertToCreateWorkOrderRequest(
    WorkOrder: WorkOrder
  ): CreateWorkOrderRequest {
    const createWorkOrderRequest: CreateWorkOrderRequest = {
      id: WorkOrder.id,
      description: WorkOrder.description,
      initialDateTime: WorkOrder.startTime,
      stateWorkOrder: WorkOrder.stateWorkOrder,
      machineId: WorkOrder.machineId,
      operatorId: WorkOrder.operatorId,
      /*inspectionPointId: WorkOrder.workOrderInspectionPoint.map(
        (point) => point.inspectionPointId
      ),*/
      //sparePartId: WorkOrder.spareParts.map((sparePart) => sparePart.id),
    };
    return createWorkOrderRequest;
  }

  useEffect(() => {
    inspectionPointService.getAllInspectionPoints().then((points) => {
      const aviableInPoints = points.filter(
        (inspectionPoints) => inspectionPoints.active
      );
      setAvailableInspectionPoints(aviableInPoints);
    });
    operatorService.getOperators().then((workOperator) => {
      setOperators(workOperator);
    });
    sparePartService.getSpareParts().then((parts) => {
      setAvailableSpareParts(parts);
      setFilteredSpareParts(parts);
    });
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

  const handleCheckboxSparePartChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const sparePartId = event.target.value;
    if (event.target.checked) {
      setSelectedSpareParts((prevSelected) => [...prevSelected, sparePartId]);
    } else {
      setSelectedSpareParts((prevSelected) =>
        prevSelected.filter((id) => id !== sparePartId)
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
      setValue("startTime", parsedDate);
    }
  };
  useEffect(() => {
    if (WorkOrder?.initialDateTime) {
      const formattedDate = new Date(
        WorkOrder.initialDateTime
      ).toLocaleDateString("es-ES");
      setDate(formattedDate);
    }
  }, [WorkOrder]);

  const translateStateWorkOrder = (state: any): string => {
    switch (state) {
      case StateWorkOrder.Waiting:
        return "Pendent";
      case StateWorkOrder.OnGoing:
        return "En curs";
      case StateWorkOrder.Paused:
        return "En pausa";
      case StateWorkOrder.Finished:
        return "Finalitzada";
      default:
        return "";
    }
  };

  async function consumeSparePart(sparePart: SparePart) {
    console.log(`Consuming spare part with ID: ${sparePart.id}`);
    const currentUnits = unitsPerSparePart[sparePart.id] || 0;
    if (
      sparePart.stock < currentUnits ||
      currentUnits == null ||
      currentUnits <= 0
    ) {
      alert("No tens tant stock!");
      return;
    }
    if (sparePart) {
      setUnitsPerSparePart((prevUnits) => ({
        ...prevUnits,
        [sparePart.id]: 0,
      }));
      sparePart.stock = sparePart.stock - currentUnits;
      sparePart.unitsConsum = currentUnits;
      setSelectedSpareParts((prevSelected) => [...prevSelected, sparePart.id]);

      const consRequest: ConsumeSparePart = {
        sparePartId: sparePart.id,
        unitsSparePart: currentUnits,
        workOrderId: workOrderSelected!.id,
      };
      await sparePartService.consumeSparePart(consRequest);
    } else {
      console.log("Spare part not found in the available parts list.");
    }
  }

  async function cancelSparePartConsumption(
    sparePartId: string,
    units: number
  ) {
    const sparePart = availableSpareParts.find((x) => x.id === sparePartId);
    if (sparePart) {
      sparePart.stock += units;
    }
    setSelectedSpareParts((prevSelected) =>
      prevSelected.filter((id) => id !== sparePartId)
    );
  }

  return (
    <>
      {machineName}
      <form
        className="bg-white p-4 rounded-lg shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className=" flex p-16">
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-xl text-gray-600 font-medium mb-2"
            >
              Codi
            </label>
            <input
              type="text"
              {...register("code")}
              id="code"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Número de Sèrie"
            />
          </div>
          <div className="mb-4 ml-4">
            <label
              htmlFor="description"
              className="block text-xl text-gray-600 font-medium mb-2"
            >
              Descripció
            </label>
            <input
              type="text"
              {...register("description")}
              id="description"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Descripció"
            />
          </div>
          <div className="ml-4">
            <label
              htmlFor="stateWorkOrder"
              className="block text-xl font-medium text-gray-700 mb-2"
            >
              Estat
            </label>
            <select
              {...register("stateWorkOrder", { valueAsNumber: true })}
              id="stateWorkOrder"
              name="stateWorkOrder"
              className="p-3 border border-gray-300 rounded-md w-full"
            >
              {Object.values(StateWorkOrder)
                .filter((value) => typeof value === "number")
                .map((state) => (
                  <option
                    key={state}
                    value={
                      typeof state === "string" ? parseInt(state, 10) : state
                    }
                  >
                    {translateStateWorkOrder(state)}
                  </option>
                ))}
            </select>
          </div>
          <div className="ml-4">
            <p className="block text-xl font-medium text-gray-700 mb-2">
              Màquina
            </p>
            <p>{workOrderSelected?.machine?.name}</p>
          </div>
        </div>
        <div className="flex p-16 w-3/2">
          <div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Selecciona les peces de recanvi
            </h3>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Filtrar per descripció"
                value={filterSparePartsText}
                onChange={(e) => setFilterSparePartsText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />

              {filteredSpareParts.slice(0, sparePartsLimit).map((sparePart) => (
                <div key={sparePart.id} className="mb-2 border p-4 rounded-md">
                  <label
                    htmlFor={`sparePart-${sparePart.id}`}
                    className="block text-gray-600 font-medium"
                  >
                    <table className="mt-2 w-full">
                      <tbody>
                        <tr>
                          <td className="font-bold">Codi:</td>
                          <td>{sparePart.code}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Descripció:</td>
                          <td>{sparePart.description}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Proveïdor:</td>
                          <td>{sparePart.refProvider}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Stock:</td>
                          <td>{sparePart.stock}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Família:</td>
                          <td>{sparePart.family}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Ubicació:</td>
                          <td>{sparePart.ubication}</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Unitats:</td>
                          <input
                            type="text"
                            className="p-3 border border-gray-300 rounded-md"
                            value={unitsPerSparePart[sparePart.id] || ""}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              setUnitsPerSparePart((prevUnits) => ({
                                ...prevUnits,
                                [sparePart.id]: value,
                              }));
                            }}
                          />
                          <button
                            disabled={selectedSpareParts.includes(sparePart.id)}
                            type="button"
                            className={`ml-4 bg-orange-400 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md ${
                              selectedSpareParts.includes(sparePart.id)
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={(e) => consumeSparePart(sparePart)}
                          >
                            Consumir
                          </button>
                        </tr>
                      </tbody>
                    </table>
                  </label>
                </div>
              ))}

              {!showMoreSpareParts && (
                <button
                  type="button"
                  onClick={handleShowMoreSpareParts}
                  className="text-blue-500 hover:underline"
                >
                  Veure més
                </button>
              )}
            </div>
          </div>
          <div className="text-black ml-4">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Peces de recanvi consumides
            </h3>

            {selectedSpareParts.map((selectedPart) => (
              <div key={selectedPart} className="mb-2 text-black">
                {
                  availableSpareParts.find(
                    (sparePart) => sparePart.id === selectedPart
                  )?.description
                }
                <span className="font-bold">{" Unitats Consumides:"} </span>
                {
                  availableSpareParts.find(
                    (sparePart) => sparePart.id === selectedPart
                  )?.unitsConsum
                }
                <button
                  type="button"
                  className="ml-4 bg-red-600 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-md"
                  onClick={(e) =>
                    cancelSparePartConsumption(
                      selectedPart,
                      availableSpareParts.find(
                        (sparePart) => sparePart.id === selectedPart
                      )!.unitsConsum!
                    )
                  }
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex p-16 w-3/2">
          <div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Operaris Assignats
            </h3>
            <div className="mb-4">
              {workOrderSelected?.operator?.map((oper) => (
                <p key={oper.id} className="font-bold mr-4">
                  {oper.name}
                </p>
              ))}
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Fitxar Operari a la ordre de treball
            </h3>
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                placeholder="Codi Operari"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 ml-4 rounded-md"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Guardar
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 ml-4 rounded-md"
        >
          Cancelar
        </button>
      </form>
    </>
  );
};

export default WorkOrderForm;
