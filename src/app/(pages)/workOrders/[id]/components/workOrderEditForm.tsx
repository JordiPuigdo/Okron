"use client";

import Operator, { OperatorType } from "app/interfaces/Operator";
import WorkOrder, {
  StateWorkOrder,
  UpdateWorkOrderRequest,
  WorkOrderComment,
  WorkOrderInspectionPoint,
  WorkOrderOperatorTimes,
  WorkOrderSparePart,
  WorkOrderType,
} from "app/interfaces/workOrder";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, set, useForm } from "react-hook-form";
import OperatorService from "app/services/operatorService";
import WorkOrderService from "app/services/workOrderService";
import { translateStateWorkOrder } from "app/utils/utils";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import ChooseSpareParts from "components/sparePart/ChooseSpareParts";
import SparePartService from "app/services/sparePartService";
import SparePart from "app/interfaces/SparePart";

import { SvgSpinner } from "app/icons/icons";
import WorkOrderOperatorComments from "components/operator/WorkOrderCommentOperator";
import WorkOrderOperatorTimesComponent from "components/operator/WorkOrderOperatorTimes";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";
import ChooseElement from "components/ChooseElement";
import { CostsObject } from "components/Costs/CostsObject";
import CompleteInspectionPoints from "components/inspectionPoint/CompleteInspectionPoint";

type WorkOrdeEditFormProps = {
  id: string;
};

enum Tab {
  OPERATORTIMES = "Temps Operaris",
  COMMENTS = "Comentaris",
  SPAREPARTS = "Recanvis",
  INSPECTIONPOINTS = "Punts d'Inspecció",
}

const WorkOrderEditForm: React.FC<WorkOrdeEditFormProps> = ({ id }) => {
  const { register, handleSubmit, setValue } = useForm<WorkOrder>({});
  const router = useRouter();
  const [currentWorkOrder, setCurrentWorkOrder] = useState<
    WorkOrder | undefined
  >(undefined);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const [workOrderOperatorTimes, setworkOrderOperatorTimes] = useState<
    WorkOrderOperatorTimes[]
  >([]);

  const [workOrderComments, setWorkOrderComments] = useState<
    WorkOrderComment[]
  >([]);

  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isFinished, setIsFinished] = useState(false);
  const { loginUser } = useSessionStore((state) => state);
  const [totalCosts, setTotalCosts] = useState<number>(0);
  const [sparePartCosts, setSparePartCosts] = useState<number>(0);
  const [operatorCosts, setOperatorCosts] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<Tab>(Tab.OPERATORTIMES);

  async function fetchWorkOrder() {
    await workOrderService
      .getWorkOrderById(id)
      .then((responseWorkOrder) => {
        if (responseWorkOrder) {
          setIsFinished(
            responseWorkOrder.stateWorkOrder == StateWorkOrder.Finished
              ? true
              : false
          );
          setCurrentWorkOrder(responseWorkOrder);
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

      if (responseWorkOrder.workOrderComments?.length! > 0) {
        setWorkOrderComments(responseWorkOrder.workOrderComments!);
      }

      if (responseWorkOrder.workOrderOperatorTimes) {
        setworkOrderOperatorTimes((prevworkOrderOperatorTimes) => {
          const newworkOrderOperatorTimes =
            responseWorkOrder.workOrderOperatorTimes!.map((t) => ({
              operator: t.operator,
              startTime: t.startTime,
              endTime: t.endTime,
              id: t.id,
              totalTime: t.endTime
                ? formatTotaltime(t.startTime, t.endTime)
                : "",
            }));
          return [...prevworkOrderOperatorTimes, ...newworkOrderOperatorTimes];
        });
      }

      const operatorTimes = responseWorkOrder.workOrderOperatorTimes;
      const spareParts = responseWorkOrder.workOrderSpareParts;
      if (
        responseWorkOrder.workOrderOperatorTimes?.length ||
        0 > 0 ||
        responseWorkOrder.workOrderSpareParts?.length ||
        0 > 0
      ) {
        const costsOperator: number[] = [];
        operatorTimes?.forEach((x) => {
          const startTime = new Date(x.startTime).getTime();
          if (x.endTime != undefined) {
            const endTime = new Date(x.endTime).getTime();

            if (endTime != undefined) {
              const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
              const costForOperator = hoursWorked * x.operator.priceHour;
              costsOperator.push(costForOperator);
            }
          }
        });
        const totalCostOperators = costsOperator?.reduce(
          (acc, x) => acc + x,
          0
        );

        const sparePartCosts = spareParts?.map(
          (x) => x.sparePart.price * x.quantity
        );
        const totalCostSpareParts =
          sparePartCosts?.length || 0 > 0
            ? sparePartCosts?.reduce((acc, price) => acc + price, 0)
            : 0;

        setSparePartCosts(parseFloat(totalCostSpareParts!.toFixed(2)));
        setOperatorCosts(parseFloat(totalCostOperators?.toFixed(2)));
        const total = totalCostOperators + totalCostSpareParts!;

        setTotalCosts(parseFloat(total.toFixed(2)));
      }
    }
  }

  const formatTotaltime = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalTimeInMilliseconds = end.getTime() - start.getTime();
    const totalTimeInSeconds = Math.floor(totalTimeInMilliseconds / 1000);
    return `${Math.floor(totalTimeInSeconds / 3600)}h ${Math.floor(
      (totalTimeInSeconds % 3600) / 60
    )}m ${totalTimeInSeconds % 60}s`;
  };

  useEffect(() => {
    fetchSparePart();
    fetchOperators();
  }, []);

  useEffect(() => {
    if (aviableOperators && availableSpareParts.length > 0) fetchWorkOrder();
  }, [aviableOperators, availableSpareParts]);

  const onSubmit: SubmitHandler<WorkOrder> = async (data) => {
    setIsLoading(true);
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
      setTimeout(() => {
        setIsLoading(false);
        setShowErrorMessage(false);
      }, 3000);
      setShowSuccessMessage(false);
      setShowErrorMessage(true);
    }
    setTimeout(() => {
      setIsLoading(false);
      window.location.reload();
    }, 2000);
  };

  async function finalizeWorkOrder() {
    setIsLoading(true);

    await workOrderService
      .updateStateWorkOrder(currentWorkOrder!.id, StateWorkOrder.Finished)
      .then((response) => {
        if (response) {
          setTimeout(() => {
            setIsLoading(false);
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error);
        setShowErrorMessage(true);
      });
  }

  async function handleReopenWorkOrder() {
    setIsLoading(true);

    await workOrderService
      .updateStateWorkOrder(currentWorkOrder!.id, StateWorkOrder.Waiting)
      .then((response) => {
        if (response) {
          setTimeout(() => {
            setIsLoading(false);
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error);
        setShowErrorMessage(true);
      });
  }

  function handleSelectOperator(operatorId: string) {
    const operator = aviableOperators?.find((x) => x.id === operatorId);
    setSelectedOperators([...selectedOperators, operator!]);
  }

  function handleDeleteSelectedOperator(operatorId: string) {
    setSelectedOperators((prevSelected) =>
      prevSelected.filter((x) => x.id !== operatorId)
    );
  }
  const renderHeader = () => {
    return (
      <div className="flex p-4 items-center flex-col sm:flex-row bg-white rounded-xl shadow-md">
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
              Equip - {currentWorkOrder?.asset?.description}
            </span>
          </div>
        </div>
        {errorMessage !== "" && (
          <p className="text-red-500 text-xl">{errorMessage}</p>
        )}
      </div>
    );
  };

  const renderForm = () => {
    return (
      <>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg my-8 p-8 shadow-md"
        >
          <div className="flex flex-row gap-8 w-full">
            <div className="w-full">
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
                disabled={isFinished}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="w-full">
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
                disabled={isFinished}
              >
                {Object.values(StateWorkOrder)
                  .filter(
                    (value) =>
                      typeof value === "number" &&
                      (isFinished || value !== StateWorkOrder.Finished)
                  )
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
            <div className="">
              <label
                htmlFor="stateWorkOrder"
                className="block text-xl font-medium text-gray-700 mb-2"
              >
                Data Inici
              </label>
              <DatePicker
                disabled={isFinished}
                id="startDate"
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={ca}
                className="p-3 border border-gray-300 rounded-md text-lg"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="operators"
                className="block text-xl font-medium text-gray-700 mb-2"
              >
                Operaris
              </label>
              <ChooseElement
                elements={aviableOperators!
                  .filter((x) => x.operatorType == OperatorType.Maintenance)
                  .map((x) => ({
                    id: x.id,
                    description: x.name,
                  }))}
                onDeleteElementSelected={handleDeleteSelectedOperator}
                onElementSelected={handleSelectOperator}
                placeholder={"Selecciona un Operari"}
                selectedElements={selectedOperators.map((x) => x.id)}
                mapElement={(aviableOperators) => ({
                  id: aviableOperators.id,
                  description: aviableOperators.description,
                })}
              />
            </div>
          </div>
          <div className="sticky gap-4 py-4 z-10">
            {totalCosts > 0 &&
              loginUser?.permission == UserPermission.Administrator && (
                <div className="w-[26%]">
                  <CostsObject
                    operatorCosts={operatorCosts}
                    sparePartCosts={sparePartCosts}
                    totalCosts={totalCosts}
                  />
                </div>
              )}
          </div>
          {!isFinished && (
            <div className="flex">
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
                Actualitzar Ordre
                {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
              </button>
              <button
                type="button"
                onClick={(e) => router.back()}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6 sm:ml-2 flex items-center"
                disabled={isLoading}
              >
                Cancelar
                {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
              </button>
              <button
                type="button"
                onClick={(e) => finalizeWorkOrder()}
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-6 sm:ml-2 flex items-center"
              >
                Finalitzar Ordre
                {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
              </button>
              <div>
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
              </div>
            </div>
          )}
          <div className="flex sm:flex-row py-4">
            {isFinished &&
              loginUser?.permission == UserPermission.Administrator && (
                <button
                  type="button"
                  onClick={(e) => handleReopenWorkOrder()}
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded sm:ml-2 flex items-center"
                >
                  Reobrir Ordre
                  {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
                </button>
              )}
          </div>
        </form>
      </>
    );
  };

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const availableTabs = Object.values(Tab).filter((tab) => {
    if (currentWorkOrder?.workOrderType === WorkOrderType.Corrective) {
      return tab !== Tab.INSPECTIONPOINTS;
    } else if (currentWorkOrder?.workOrderType === WorkOrderType.Preventive) {
      return tab !== Tab.SPAREPARTS;
    }
    return true;
  });

  if (!currentWorkOrder) return <>Carregant Dades</>;
  return (
    <>
      {renderHeader()}
      {renderForm()}

      <div className="bg-white rounded-xl">
        <div className=" p-4 flex gap-1 border-black border-b-2">
          {availableTabs.map((tab) => (
            <p
              key={tab}
              className={`p-4 border-blue-500 border-2 rounded-xl hover:cursor-pointer ${
                activeTab === tab ? "border-t-4" : ""
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </p>
          ))}
        </div>

        {availableSpareParts !== undefined &&
          activeTab === Tab.SPAREPARTS &&
          currentWorkOrder &&
          currentWorkOrder.workOrderType === WorkOrderType.Corrective && (
            <ChooseSpareParts
              availableSpareParts={availableSpareParts}
              selectedSpareParts={selectedSpareParts}
              setSelectedSpareParts={setSelectedSpareParts}
              WordOrderId={currentWorkOrder.id}
              isFinished={isFinished}
            />
          )}
        {currentWorkOrder &&
          activeTab === Tab.INSPECTIONPOINTS &&
          currentWorkOrder.workOrderType === WorkOrderType.Preventive && (
            <CompleteInspectionPoints
              workOrderInspectionPoints={passedInspectionPoints!}
              setCompletedWorkOrderInspectionPoints={setPassedInspectionPoints}
              workOrderId={currentWorkOrder.id}
              isFinished={isFinished}
            />
          )}

        {currentWorkOrder &&
          activeTab === Tab.OPERATORTIMES &&
          aviableOperators !== undefined && (
            <WorkOrderOperatorTimesComponent
              operators={aviableOperators!}
              workOrderOperatortimes={workOrderOperatorTimes}
              setWorkOrderOperatortimes={setworkOrderOperatorTimes}
              workOrderId={currentWorkOrder.id}
              isFinished={isFinished}
            />
          )}
        {currentWorkOrder && activeTab === Tab.COMMENTS && (
          <WorkOrderOperatorComments
            workOrderComments={workOrderComments}
            workOrderId={currentWorkOrder.id}
            isFinished={isFinished}
            setWorkOrderComments={setWorkOrderComments}
          />
        )}
      </div>
    </>
  );
};

export default WorkOrderEditForm;
