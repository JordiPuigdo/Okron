"use client";
import ChooseOperator from "components/operator/ChooseOperator";
import Operator from "interfaces/Operator";
import WorkOrder, {
  StateWorkOrder,
  UpdateWorkOrderRequest,
  WorkOrderInspectionPoint,
  WorkOrderSparePart,
  WorkOrderTimes,
  WorkOrderType,
} from "interfaces/workOrder";
import { Averia_Sans_Libre } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import OperatorService from "services/operatorService";
import WorkOrderService from "services/workOrderService";
import { translateStateWorkOrder } from "utils/utils";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import ChooseSpareParts from "components/sparePart/ChooseSpareParts";
import SparePartService from "services/sparePartService";
import SparePart from "interfaces/SparePart";
import CompleteInspectionPoints from "components/inspectionPoint/ChooseInspectionPoint";
import WorkOrderOperatorTimes from "components/operator/WorkOrderOperatorTimes";

type WorkOrdeEditFormProps = {
  id: string;
};

const WorkOrderEditForm: React.FC<WorkOrdeEditFormProps> = ({ id }) => {
  const { register, handleSubmit, setValue } = useForm<WorkOrder>({});
  const router = useRouter();
  const [currentWorkOrder, setCurrentWorkOrder] = useState<
    WorkOrder | undefined
  >(undefined);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [aviableOperators, setAviableOperators] = useState<
    Operator[] | undefined
  >(undefined);
  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>(
    []
  );
  const [selectedSpareParts, setSelectedSpareParts] = useState<
    WorkOrderSparePart[]
  >([]);

  const [inspectionPoints, setInspectionPoints] = useState<
    WorkOrderInspectionPoint[]
  >([]);
  const [passedInspectionPoints, setPassedInspectionPoints] = useState<
    WorkOrderInspectionPoint[]
  >([]);

  const [workOrderTimes, setWorkOrderTimes] = useState<WorkOrderTimes[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  async function fetchWorkOrder() {
    await workOrderService
      .getWorkOrderById(id)
      .then((responseWorkOrder) => {
        if (responseWorkOrder) {
          setCurrentWorkOrder(responseWorkOrder);
          console.log(responseWorkOrder.workOrderType);
          loadForm(responseWorkOrder);
        }
      })
      .catch((e) => {
        setErrorMessage("Error carregant les dades " + e.message);
      });
  }

  async function fetchSparePart() {
    await sparePartService
      .getSpareParts()
      .then((parts) => {
        setAvailableSpareParts(parts);
      })
      .catch((e) => {
        setErrorMessage("Error carregant les dades dels recanvis " + e.message);
      });
  }
  async function fetchOperators() {
    await operatorService
      .getOperators()
      .then((responseOperators) => {
        if (responseOperators) {
          setAviableOperators(responseOperators);
          return responseOperators;
        }
      })
      .catch((e) => {
        setErrorMessage("Error carregant les dades " + e.message);
      });
  }

  async function loadForm(responseWorkOrder: WorkOrder | null) {
    if (responseWorkOrder) {
      setValue("code", responseWorkOrder.code);
      setValue("description", responseWorkOrder.description);
      setValue("stateWorkOrder", responseWorkOrder.stateWorkOrder);
      setValue("startTime", responseWorkOrder.startTime);

      const finalData = new Date(responseWorkOrder.startTime);
      setStartDate(finalData);
      const operatorsToAdd = aviableOperators?.filter((operator: any) =>
        responseWorkOrder.operatorId!.includes(operator.id)
      );

      setSelectedOperators((prevSelected) => [
        ...prevSelected,
        ...operatorsToAdd!,
      ]);

      if (
        responseWorkOrder &&
        responseWorkOrder.workOrderSpareParts &&
        responseWorkOrder.workOrderSpareParts.length > 0
      ) {
        setSelectedSpareParts((prevSelected) => [
          ...prevSelected,
          ...responseWorkOrder.workOrderSpareParts!,
        ]);
      }

      setPassedInspectionPoints(responseWorkOrder.workOrderInspectionPoint!);
      /*const x = responseWorkOrder.workOrderInspectionPoint?.map(
        (order) => order.inspectionPoint
      );
      if (x) setInspectionPoints(x!);*/
      if (responseWorkOrder.workOrderInspectionPoint?.length! > 0 || 0)
        setInspectionPoints(responseWorkOrder.workOrderInspectionPoint!);

      if (responseWorkOrder.workOrderTimes) {
        setWorkOrderTimes(responseWorkOrder.workOrderTimes!);
      }
    }
  }
  useEffect(() => {
    fetchSparePart();
    fetchOperators();
  }, []);

  useEffect(() => {
    if (aviableOperators && availableSpareParts.length > 0) fetchWorkOrder();
  }, [aviableOperators, availableSpareParts]);

  const onSubmit: SubmitHandler<WorkOrder> = async (data) => {
    try {
      const updatedWorkOrderData: UpdateWorkOrderRequest = {
        id: id,
        description: data.description,
        stateWorkOrder: data.stateWorkOrder,
        operatorId: selectedOperators.map((x) => x.id),
        startTime: startDate || new Date(),
      };

      await workOrderService.updateWorkOrder(updatedWorkOrderData);

      setShowSuccessMessage(true);
      setShowErrorMessage(false);
    } catch (error) {
      setShowSuccessMessage(false);
      setShowErrorMessage(true);
    }
  };

  function finalizeWorkOrder() {
    console.log("Finalize!");
  }

  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 pt-12 items-center flex-col sm:flex-row">
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
        <div className="items-center text-center w-full">
          <div className="mb-4">
            <span className="text-2xl font-bold text-black mx-auto">
              Ordre de Treball - {currentWorkOrder?.code}
            </span>
          </div>
          <div>
            <span className="text-xl font-bold text-black mx-auto">
              Màquina - {currentWorkOrder?.machine?.name}
            </span>
          </div>
        </div>
        {errorMessage !== "" && (
          <p className="text-red-500 text-xl">{errorMessage}</p>
        )}
      </div>
    );
  };

  if (!currentWorkOrder) return <>Carregant Dades</>;
  return (
    <>
      {renderHeader()}
      <div className="p-4 sm:p-12">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="sm:w-1/2 ml-4">
              <label
                htmlFor="description"
                className="block text-xl font-medium text-gray-700 mb-2"
              >
                Descripció
              </label>
              <input
                {...register("description")}
                type="text"
                id="description"
                name="description"
                className="p-3 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="sm:w-1/2 ml-4">
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
            <div className="sm:w-1/2 ml-4">
              <label
                htmlFor="stateWorkOrder"
                className="block text-xl font-medium text-gray-700 mb-2"
              >
                Data Inici
              </label>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={ca}
                className="p-3 border border-gray-300 rounded-md text-lg"
              />
            </div>
          </div>
          {aviableOperators !== undefined && currentWorkOrder && (
            <ChooseOperator
              aviableOperators={aviableOperators}
              selectedOperators={selectedOperators}
              setSelectedOperators={setSelectedOperators}
            />
          )}
          {availableSpareParts !== undefined &&
            currentWorkOrder &&
            currentWorkOrder.workOrderType === WorkOrderType.Corrective && (
              <ChooseSpareParts
                availableSpareParts={availableSpareParts}
                selectedSpareParts={selectedSpareParts}
                setSelectedSpareParts={setSelectedSpareParts}
                WordOrderId={currentWorkOrder.id}
              />
            )}
          {currentWorkOrder &&
            currentWorkOrder.workOrderType === WorkOrderType.Preventive && (
              <CompleteInspectionPoints
                workOrderInspectionPoints={passedInspectionPoints!}
                setCompletedWorkOrderInspectionPoints={
                  setPassedInspectionPoints
                }
              />
            )}

          {currentWorkOrder && aviableOperators !== undefined && (
            <WorkOrderOperatorTimes
              operators={aviableOperators!}
              workOrdertimes={workOrderTimes}
              setWorkOrderTimes={setWorkOrderTimes}
            />
          )}
          <div className="flex flex-col sm:flex-row mb-8 pt-12">
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
              } text-white font-bold py-2 px-4 rounded mt-6 mb-4 sm:mb-0 sm:mr-2`}
            >
              Actualizar Ordre
            </button>
            <button
              type="button"
              onClick={(e) => router.back()}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6 sm:ml-2"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => finalizeWorkOrder()}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-6 sm:ml-2"
            >
              Finalitzar Ordre
            </button>
          </div>

          {showSuccessMessage && (
            <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
              Ordre actualizada correctament
            </div>
          )}

          {showErrorMessage && (
            <div className="bg-red-200 text-red-800 p-4 rounded mb-4">
              Error actualitzant ordre de treball
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default WorkOrderEditForm;
