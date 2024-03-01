"use client";

import { Corrective } from "app/interfaces/Corrective";
import Operator from "app/interfaces/Operator";
import Machine from "app/interfaces/machine";
import {
  CreateWorkOrderRequest,
  StateWorkOrder,
  WorkOrderType,
} from "app/interfaces/workOrder";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import MachineService from "components/services/machineService";
import OperatorService from "components/services/operatorService";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import WorkOrderService from "components/services/workOrderService";
import { SvgSpinner } from "app/icons/icons";
import { translateStateWorkOrder } from "app/utils/utils";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";

function CorrectivePage() {
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const machinService = new MachineService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string[]>([]);

  const [machines, setMachines] = useState<Machine[]>([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const { register, handleSubmit, setValue } = useForm<Corrective>();

  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  async function fetchFormData() {
    await fetchOperators();
    await fetchMachines();
    await createCode();

    setIsLoadingPage(false);
  }

  async function createCode() {
    await workOrderService
      .countByWorkOrderType(WorkOrderType.Corrective)
      .then((numberCorrectives) => {
        numberCorrectives = numberCorrectives += 1;
        const paddedCounter = numberCorrectives
          ? numberCorrectives.toString().padStart(4, "0")
          : "0000";
        const code = "COR" + paddedCounter;
        setValue("code", code);
      })
      .catch((error) => {
        setErrorMessage("Error Operaris: " + error);
      });
  }

  async function fetchOperators() {
    await operatorService
      .getOperators()
      .then((aviableOperators) => {
        setOperators(aviableOperators);
      })
      .catch((error) => {
        setErrorMessage("Error Operaris: " + error);
      });
  }

  async function fetchMachines() {
    await machinService
      .getAllMachines()
      .then((aviableMachines) => {
        setMachines(aviableMachines.filter((x) => x.active));
      })
      .catch((error) => {
        setErrorMessage("Error Màquines: " + error);
      });
  }

  useEffect(() => {
    fetchFormData();
  }, []);

  function convertToCreateWorkOrderRequest(
    corrective: Corrective
  ): CreateWorkOrderRequest {
    const createWorkOrderRequest: CreateWorkOrderRequest = {
      code: corrective.code,
      description: corrective.description,
      initialDateTime: corrective.startTime,
      machineId: corrective.machineId,
      operatorId: corrective.operators.map((operator) => operator),
      stateWorkOrder: corrective.stateWorkOrder,
      workOrderType: 0,
    };
    return createWorkOrderRequest;
  }

  useEffect(() => {
    setValue("stateWorkOrder", StateWorkOrder.Waiting);
  }, [setValue]);

  const onSubmit: SubmitHandler<Corrective> = async (data) => {
    setIsLoading(true);
    if (!validData(data)) {
      setIsLoading(false);
      alert("Falten dades per completar");
      return;
    }
    data.startTime = startDate || new Date();
    await machinService
      .createMachineWorkOrder(
        convertToCreateWorkOrderRequest(data),
        data.machineId
      )
      .then((aviableMachines) => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage("Error Màquines: " + error);
      });
  };

  function validData(corrective: Corrective) {
    if (!corrective.description || corrective.description.trim().length === 0) {
      return false;
    }
    if (corrective.operators.length == 0) {
      return false;
    }

    return true;
  }
  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row">
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
          Crear Correctiu
        </h2>

        {errorMessage !== "" && (
          <p className="text-red-500 text-xl">{errorMessage}</p>
        )}
      </div>
    );
  };

  if (isLoadingPage) return <MainLayout>Carregant dades...</MainLayout>;
  else
    return (
      <MainLayout>
        <Container>
          {renderHeader()}
          <div className="p-4 sm:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
              <div className="flex flex-col sm:flex-row">
                <div className="mb-6 sm:w-1/2">
                  <label
                    htmlFor="code"
                    className="block text-xl font-medium text-gray-700 mb-2"
                  >
                    Núm. Sèrie
                  </label>
                  <input
                    {...register("code")}
                    type="text"
                    id="code"
                    name="code"
                    readOnly
                    className="p-3 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="mb-6 sm:w-1/2 sm:ml-6">
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
                    placeholder="Descripció del correctiu"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row">
                <div className="mb-6 sm:w-1/2">
                  <label
                    htmlFor="machine"
                    className="block text-xl font-medium text-gray-700 mb-2"
                  >
                    Màquina
                  </label>
                  <select
                    {...register("machineId")}
                    id="machine"
                    name="machine"
                    className="p-3 border border-gray-300 rounded-md w-full"
                    onChange={(e) => {
                      setValue("machineId", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  >
                    {machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6 sm:w-1/2 sm:ml-6">
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
                            typeof state === "string"
                              ? parseInt(state, 10)
                              : state
                          }
                        >
                          {translateStateWorkOrder(state)}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="mb-6 sm:mr-6">
                  <label
                    htmlFor="startDate"
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

                <div className="mb-6">
                  <label className="block text-xl font-medium text-gray-700 mb-2">
                    Operaris
                  </label>
                  <div className="flex flex-wrap">
                    {operators.map((operator) => (
                      <div key={operator.id} className="mr-4 mb-2">
                        <input
                          type="checkbox"
                          id={`operator-${operator.id}`}
                          value={operator.id}
                          {...register("operators")}
                        />
                        <label
                          htmlFor={`operator-${operator.id}`}
                          className="ml-2 text-lg"
                        >
                          {operator.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row mb-8">
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
                  } text-white font-bold py-2 px-4 rounded mt-6 mb-4 sm:mb-0 sm:mr-2 flex items-center`}
                >
                  Crear Correctiu
                  {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => router.back()}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6 sm:ml-2"
                >
                  Cancelar
                </button>
              </div>

              {showSuccessMessage && (
                <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
                  Correctiu creat correctament
                </div>
              )}

              {showErrorMessage && (
                <div className="bg-red-200 text-red-800 p-4 rounded mb-4">
                  Error al crear Correctiu
                </div>
              )}
            </form>
          </div>
        </Container>
      </MainLayout>
    );
}

export default CorrectivePage;
