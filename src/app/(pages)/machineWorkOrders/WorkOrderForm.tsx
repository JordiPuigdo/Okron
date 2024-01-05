import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import WorkOrder, {
  CreateWorkOrderRequest,
  stateWorkOrder,
} from "../../../interfaces/workOrder";
import InspectionPoint from "interfaces/inspectionPoint";
import InspectionPointService from "services/inspectionPointService";
import OperatorService from "services/operatorService";
import Operator from "interfaces/Operator";
import SparePartService from "services/sparePartService";
import SparePart from "interfaces/SparePart";

type WorkOrderFormProps = {
  WorkOrder?: CreateWorkOrderRequest;
  onSubmit: SubmitHandler<CreateWorkOrderRequest>;
  machineName: string;
  WorkOrderCreated?: WorkOrder;
};

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  WorkOrder,
  onSubmit,
  machineName,
}) => {
  const { register, handleSubmit, setValue } = useForm<WorkOrder>({
    defaultValues: WorkOrder,
  });
  const inspectionPointService = new InspectionPointService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const sparePartService = new SparePartService("http://localhost:5254");
  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>(
    []
  );
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>([]);

  const [selectedSpareParts, setSelectedSpareParts] = useState<string[]>([]);
  const [filterSparePartsText, setFilterSparePartsText] = useState<string>("");
  const [showMoreSpareParts, setShowMoreSpareParts] = useState(false);
  const [sparePartsLimit, setSparePartsLimit] = useState(5);

  const handleShowMoreSpareParts = () => {
    setShowMoreSpareParts(true);
    setSparePartsLimit((prevLimit) => prevLimit + 10);
  };

  const operatorService = new OperatorService("http://localhost:5254/");
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

  const [filterText, setFilterText] = useState<string>("");
  const stateWorkOrderStrings: Record<stateWorkOrder, string> = {
    [stateWorkOrder.Waiting]: "En Espera",
    [stateWorkOrder.OnGoing]: "En Curs",
    [stateWorkOrder.Paused]: "Pausada",
    [stateWorkOrder.Finished]: "Acabada",
  };
  const filteredInspectionPoints = availableInspectionPoints.filter((point) =>
    point.description.toLowerCase().includes(filterText.toLowerCase())
  );

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
      })
    );
    data.WorkOrderInspectionPoint = selectedPointsWithData;
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
      initialDateTime: WorkOrder.initialDateTime,
      stateWorkOrder: 0,
      machineId: WorkOrder.machineId,
      operatorId: WorkOrder.operatorId,
      inspectionPointId: WorkOrder.WorkOrderInspectionPoint.map(
        (point) => point.id
      ),
      sparePartId: WorkOrder.spareParts.map((sparePart) => sparePart.id),
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

  return (
    <>
      {machineName}
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-600 font-medium mb-2"
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
        <div className="flex">
          <div className="mb-4 mr-4">
            <label
              htmlFor="initialDateTime"
              className="block text-gray-600 font-medium mb-2"
            >
              Data Inici
            </label>
            <input
              type="datetime-local"
              {...register("initialDateTime")}
              id="initialDateTime"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Initial Date and Time"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="state"
              className="block text-gray-600 font-medium mb-2"
            >
              Estat Inicial
            </label>
            <select
              {...register("stateWorkOrder")}
              id="stateWorkOrder"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              {Object.keys(stateWorkOrder).map((state) => (
                <option key={state} value={state}>
                  {stateWorkOrderStrings[state as unknown as stateWorkOrder]}
                </option>
              ))}
            </select>
          </div>
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

        <div style={{ flex: 1 }}>
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
                  <input
                    type="checkbox"
                    id={`sparePart-${sparePart.id}`}
                    value={sparePart.id}
                    onChange={handleCheckboxSparePartChange}
                    checked={selectedSpareParts.includes(sparePart.id)}
                  />
                  <table className="mt-2 w-full">
                    <tbody>
                      <tr>
                        <td className="font-bold">Code:</td>
                        <td>{sparePart.code}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Description:</td>
                        <td>{sparePart.description}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Ref Provider:</td>
                        <td>{sparePart.refProvider}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Stock:</td>
                        <td>{sparePart.stock}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Family:</td>
                        <td>{sparePart.family}</td>
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
                Show More
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Peces de recanvi seleccionades
          </h3>

          {selectedSpareParts.map((selectedPart) => (
            <div key={selectedPart} className="mb-2">
              {
                availableSpareParts.find(
                  (sparePart) => sparePart.id === selectedPart
                )?.description
              }
            </div>
          ))}
        </div>

        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Selecciona els operaris
        </h3>
        <div className="mb-4">
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Crear
        </button>
      </form>
    </>
  );
};

export default WorkOrderForm;
