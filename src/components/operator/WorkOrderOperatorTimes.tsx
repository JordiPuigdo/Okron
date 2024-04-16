import React, { useState } from "react";
import {
  AddWorkOrderOperatorTimes,
  DeleteWorkOrderOperatorTimes,
  FinishWorkOrderOperatorTimes,
  UpdateWorkOrderOperatorTimes,
  WorkOrderOperatorTimes,
} from "app/interfaces/workOrder";
import Operator from "app/interfaces/Operator";
import { formatDate } from "app/utils/utils";
import WorkOrderService from "app/services/workOrderService";
import { SvgSpinner } from "app/icons/icons";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";
import { set } from "react-hook-form";
import { start } from "repl";

interface IWorkOrderOperatorTimes {
  operators: Operator[];
  workOrderOperatortimes: WorkOrderOperatorTimes[];
  setWorkOrderOperatortimes: React.Dispatch<
    React.SetStateAction<WorkOrderOperatorTimes[]>
  >;
  workOrderId: string;
  isFinished: boolean;
}

const WorkOrderOperatorTimesComponent: React.FC<IWorkOrderOperatorTimes> = ({
  operators,
  workOrderOperatortimes,
  setWorkOrderOperatortimes,
  workOrderId,
  isFinished,
}) => {
  const [codeOperator, setCodeOperator] = useState("");
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enterManualTime, setEnterManualTime] = useState(false);
  const [manualTime, setManualTime] = useState(
    formatDate(new Date(), true, false)
  );
  const { loginUser } = useSessionStore((state) => state);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedStartTime, setEditedStartTime] = useState("");
  const [editedEndTime, setEditedEndTime] = useState("");

  const addWorkOrderTime = async () => {
    setIsLoading(true);
    const op = operators.find((x) => x.code === codeOperator);
    if (!op) {
      alert("Codi Operari Incorrecte");
      setIsLoading(false);
      return;
    }

    const last = workOrderOperatortimes.find(
      (time) =>
        time.operator.id === op.id &&
        (time.endTime === undefined || time.endTime === null)
    );

    if (last) {
      alert("Aquest Operari és dins l'ordre de treball");
      setIsLoading(false);
      return;
    }
    const startTime = createDate();
    if (startTime == null) {
      setIsLoading(false);
      return;
    }
    const x: AddWorkOrderOperatorTimes = {
      operatorId: op.id,
      startTime: startTime,
      WorkOrderId: workOrderId,
    };
    await workOrderService
      .addWorkOrderOperatorTimes(x)
      .then((x) => {
        const newworkOrderOperatortimes: WorkOrderOperatorTimes = {
          startTime: startTime,
          endTime: undefined,
          operator: op,
          id: x.workOrderOperatorTimesId,
        };
        setWorkOrderOperatortimes((prevSelected) => [
          ...prevSelected,
          newworkOrderOperatortimes,
        ]);
      })
      .catch((e) => {
        setIsLoading(false);
        setErrorMessage("Error fitxant operari " + e);
      })
      .finally(() => {
        setIsLoading(false);
        setCodeOperator("");
      });
  };

  const finishWorkOrderTime = async () => {
    setIsLoading(true);
    const op = operators.find((x) => x.code === codeOperator);
    if (!op) {
      alert("Codi Operari Incorrecte");
      setIsLoading(false);
      return;
    }

    const last = workOrderOperatortimes.find(
      (time) =>
        time.operator.id === op.id &&
        (time.endTime === undefined || time.endTime === null)
    );

    if (!last) {
      alert("Aquest Operari no està fitxat");
      setIsLoading(false);
      return;
    }

    const endTime = createDate();
    if (endTime == null) {
      setIsLoading(false);
      return;
    }
    const startTime = new Date(last!.startTime);
    const totalTimeInMilliseconds = endTime.getTime() - startTime.getTime();
    const totalTimeInSeconds = Math.floor(totalTimeInMilliseconds / 1000);
    const totalTime = `${Math.floor(totalTimeInSeconds / 3600)}h ${Math.floor(
      (totalTimeInSeconds % 3600) / 60
    )}m ${totalTimeInSeconds % 60}s`;

    const updatedTimes = workOrderOperatortimes.map((time) =>
      time.operator.id === last!.operator.id
        ? { ...time, endTime, totalTime }
        : time
    );

    const FinishWorkOrderOperatorTimes: FinishWorkOrderOperatorTimes = {
      operatorId: op.id,
      finishTime: endTime,
      WorkOrderId: workOrderId,
    };
    await workOrderService
      .finishWorkOrderOperatorTimes(FinishWorkOrderOperatorTimes)
      .then((response) => {
        setWorkOrderOperatortimes(updatedTimes);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setErrorMessage("Error fitxant operari " + e);
      })
      .finally(() => {
        setIsLoading(false);
        setCodeOperator("");
      });
  };

  const totalTimeByOperatorId: { [id: string]: number } = {};
  workOrderOperatortimes.forEach((time) => {
    const operatorId = time.operator.id;
    if (time.totalTime) {
      const [hours, minutes, seconds] = time.totalTime.split(" ");
      const totalTimeInSeconds =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      if (!totalTimeByOperatorId[operatorId]) {
        totalTimeByOperatorId[operatorId] = totalTimeInSeconds;
      } else {
        totalTimeByOperatorId[operatorId] += totalTimeInSeconds;
      }
    }
  });

  const totalTimes: { [id: string]: string } = {};
  Object.keys(totalTimeByOperatorId).forEach((operatorId) => {
    const totalTimeInSeconds = totalTimeByOperatorId[operatorId];
    const totalHours = Math.floor(totalTimeInSeconds / 3600);
    const totalMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
    const totalSeconds = totalTimeInSeconds % 60;
    totalTimes[operatorId] = `${totalHours}h ${totalMinutes}m ${totalSeconds}s`;
  });

  const totalMilliseconds = workOrderOperatortimes.reduce((total, time) => {
    if (time.totalTime) {
      const [hours, minutes, seconds] = time.totalTime.split(" ");
      const totalTimeInSeconds =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      return total + totalTimeInSeconds * 1000; // Convert seconds to milliseconds
    } else {
      return total;
    }
  }, 0);

  const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
  const totalMinutes = Math.floor(
    (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const totalSeconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

  const totalFormatted = `${totalHours}h ${totalMinutes}m ${totalSeconds}s`;

  const handleManualTimeChange = (event: any) => {
    setManualTime(event.target.value);
  };

  function createDate(newDate = ""): Date | null {
    if (enterManualTime) {
      if (manualTime && !enterManualTime) {
        const confirmation = window.confirm(
          `Tens la data ${manualTime}, vols continuar?`
        );
        if (!confirmation) return null;
      }
      if (!validateDateTimeFormat(manualTime!)) {
        alert("Format incorrecte, dia/mes/any hores/minuts");
        return null;
      }
      const [day, month, year, hour, minute] =
        manualTime!.length > 0
          ? manualTime!.split(/[\/ :]/)
          : newDate.split(/[\/ :]/);

      setManualTime(formatDate(new Date(), true, false));
      setEnterManualTime(false);
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
    } else if (newDate.length > 0) {
      const [day, month, year, hour, minute] = newDate.split(/[\/ :]/);
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
    } else {
      return new Date();
    }
  }

  function validateDateTimeFormat(dateTime: string): boolean {
    const pattern =
      /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    return pattern.test(dateTime);
  }

  async function updateWorkOrderOperatorTimes(
    index: number,
    workOrderOperatorTimesId: string,
    starttime: string,
    endtime: string
  ) {
    if (editingIndex === index) {
      if (!validateDateTimeFormat(editedStartTime)) {
        alert("Format incorrecte, dia/mes/any hores/minuts");
        return null;
      }

      let newStartTime = createDate(
        editedStartTime.length > 0 ? editedStartTime : starttime
      );

      let updateWorkOrderOperatorTimes: UpdateWorkOrderOperatorTimes = {
        workOrderId: workOrderId,
        startTime: newStartTime!,
        workOrderOperatorTimesId: workOrderOperatorTimesId,
      };
      if (editedEndTime != null) {
        if (editedEndTime != "" && !validateDateTimeFormat(editedEndTime)) {
          alert("Format incorrecte, dia/mes/any hores/minuts");
          return null;
        }
        let newEndTime = createDate(
          editedEndTime.length > 0 ? editedEndTime : endtime
        );
        updateWorkOrderOperatorTimes.endTime = newEndTime!;
      }

      await workOrderService
        .updateWorkOrderOperatorTimes(updateWorkOrderOperatorTimes)
        .then((response) => {
          window.location.reload();
        })
        .catch((e) => {
          setIsLoading(false);
          setErrorMessage("Error fitxant operari " + e);
        })
        .finally(() => {
          setIsLoading(false);
          setCodeOperator("");
        });
      setEditedEndTime("");
      setEditedStartTime("");
      setEditingIndex(-1);
    } else {
      setEditingIndex(index);
      setEditedEndTime(formatDate(endtime!, true, false)!);
      setEditedStartTime(formatDate(starttime!, true, false)!);
    }
  }

  async function deleteWorkOrderOperatorTimes(operatorTimesId: string) {
    const x: DeleteWorkOrderOperatorTimes = {
      workOrderId: workOrderId,
      workOrderOperatorTimesId: operatorTimesId,
    };

    await workOrderService.deleteWorkOrderOperatorTimes(x).then((response) => {
      window.location.reload();
    });
  }

  return (
    <div className="mx-auto px-4 py-8 mt-12">
      <div className="flex flex-col">
        <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-400">
          <span className="text-xl font-bold">Temps d'Operari</span>
        </div>

        <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
        <div className="flex space-x-4 mt-6 items-center">
          <span className="text-lg font-bold">Codi Operari</span>
          <input
            type="text"
            value={codeOperator}
            onChange={(e) => {
              setCodeOperator(e.target.value);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            disabled={isFinished}
          />
          <button
            type="button"
            disabled={isLoading || isFinished}
            onClick={addWorkOrderTime}
            className={`${
              isFinished
                ? "bg-gray-500"
                : "bg-blue-500  hover:bg-blue-600 focus:bg-blue-600"
            } px-4 py-2 text-white rounded-md focus:outline-none  flex items-center`}
          >
            Entrar
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
          <button
            type="button"
            disabled={isLoading || isFinished}
            onClick={finishWorkOrderTime}
            className={`${
              isFinished
                ? "bg-gray-500"
                : "bg-red-500 hover:bg-red-600 focus:bg-red-600"
            } px-4 py-2  text-white rounded-md focus:outline-none  flex items-center`}
          >
            Sortir
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
          <button
            type="button"
            className={`${
              isFinished
                ? "bg-gray-500"
                : "bg-orange-500 hover:bg-orange-600 focus:bg-orange-600"
            } px-4 py-2  text-white rounded-md focus:outline-none  flex items-center`}
            onClick={(e) => {
              setEnterManualTime(!enterManualTime);
            }}
          >
            Entrada Manual
          </button>
          {enterManualTime && (
            <>
              <input
                type="text"
                pattern="\d{2}/\d{2}/\d{4} \d{2}:\d{2}"
                placeholder="dd/mm/yyyy hh:mm"
                value={manualTime!}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                onChange={handleManualTimeChange}
              />
            </>
          )}
        </div>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
      <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-40 mt-6">
        <span className="text-xl font-bold">Registres</span>
      </div>
      <div className="mt-6">
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider"
                >
                  Entrada
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sortida
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider"
                >
                  Temps Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider"
                >
                  Operari
                </th>
                {loginUser?.permission == UserPermission.Administrator && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Accions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workOrderOperatortimes.map((time, index) => (
                <tr
                  key={time.id}
                  className={` ${
                    time.endTime === undefined || time.endTime === null
                      ? "bg-green-300"
                      : "bg-gray-300"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-900 flex flex-col">
                      {formatDate(time.startTime.toLocaleString())}
                      {editingIndex === index && (
                        <input
                          type="text"
                          className="text-lg text-gray-900 w-full border-0"
                          value={editedStartTime}
                          onChange={(e) => {
                            setEditedStartTime(e.target.value);
                          }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-900 flex flex-col">
                      {formatDate(time.endTime?.toLocaleString())}
                      {editingIndex === index &&
                        formatDate(time.endTime?.toLocaleString()) !== null && (
                          <input
                            type="text"
                            className="text-lg text-gray-900 w-full border-0"
                            value={editedEndTime}
                            onChange={(e) => {
                              setEditedEndTime(e.target.value);
                            }}
                          />
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-900">
                      {time.totalTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-900 font-bold">
                      {time.operator.name}
                    </div>
                  </td>
                  {loginUser?.permission == UserPermission.Administrator && (
                    <td className="px-6 py-4 whitespace-nowrap align-center flex flex-row gap-4">
                      <button
                        type="button"
                        className={`${
                          isFinished
                            ? "bg-gray-500"
                            : "bg-green-500 hover:bg-green-600 focus:bg-green-600"
                        } px-4 py-2  text-white rounded-md focus:outline-none  flex items-center`}
                        onClick={() =>
                          updateWorkOrderOperatorTimes(
                            index,
                            time.id!,
                            time.startTime.toString(),
                            time.endTime != null ? time.endTime?.toString() : ""
                          )
                        }
                      >
                        {editingIndex === index ? "Guardar" : "Editar"}
                      </button>
                      {editingIndex === index && (
                        <>
                          <button
                            type="button"
                            className={`${
                              isFinished
                                ? "bg-gray-500"
                                : "bg-gray-500 hover:bg-gray-600 focus:bg-gray-600"
                            } px-4 py-2  text-white rounded-md focus:outline-none  flex items-center`}
                            onClick={(e) => {
                              setEditingIndex(-1);
                              setEditedEndTime("");
                              setEditedStartTime("");
                            }}
                          >
                            {"Cancelar"}
                          </button>
                          <button
                            type="button"
                            className={`${
                              isFinished
                                ? "bg-gray-500"
                                : "bg-red-500 hover:bg-red-600 focus:bg-red-600"
                            } px-4 py-2  text-white rounded-md focus:outline-none  flex items-center`}
                            onClick={(e) => {
                              setEditingIndex(-1);
                              setEditedEndTime("");
                              setEditedStartTime("");
                              deleteWorkOrderOperatorTimes(time.id!);
                            }}
                          >
                            {"Eliminar"}
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={2}></td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 font-bold">
                  Temps Total
                </td>
                <td
                  colSpan={
                    loginUser?.permission == UserPermission.Administrator
                      ? 3
                      : 2
                  }
                  className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 font-bold"
                >
                  {totalFormatted}
                </td>
              </tr>
              {Object.keys(totalTimes).map((operatorId) => (
                <tr key={operatorId}>
                  <td
                    colSpan={
                      loginUser?.permission == UserPermission.Administrator
                        ? 4
                        : 3
                    }
                  ></td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 font-bold">
                    {operators.find((op) => op.id === operatorId)?.name}:{" "}
                    {totalTimes[operatorId]}
                  </td>
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
    </div>
  );
};

export default WorkOrderOperatorTimesComponent;
