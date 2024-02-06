import React, { useState } from "react";
import { WorkOrderTimes } from "interfaces/workOrder";
import Operator from "interfaces/Operator";
import { formatDate } from "utils/utils";

interface WorkOrderOperatorTimes {
  operators: Operator[];
  workOrdertimes: WorkOrderTimes[];
  setWorkOrderTimes: React.Dispatch<React.SetStateAction<WorkOrderTimes[]>>;
}

const WorkOrderOperatorTimes: React.FC<WorkOrderOperatorTimes> = ({
  operators,
  workOrdertimes,
  setWorkOrderTimes,
}) => {
  const [codeOperator, setCodeOperator] = useState("");

  const addWorkOrderTime = () => {
    const op = operators.find((x) => x.code === codeOperator);
    if (!op) {
      alert("Codi Operari Incorrecte");
      return;
    }
    const last = workOrdertimes.find(
      (time) => time.operator.id === op.id && time.endTime === undefined
    );

    if (last) {
      alert("Aquest Operari és dins l'ordre de treball");
      return;
    }

    const newWorkOrderTimes: WorkOrderTimes = {
      startTime: new Date(),
      endTime: undefined,
      operator: op,
    };

    setWorkOrderTimes((prevSelected) => [...prevSelected, newWorkOrderTimes]);
    setCodeOperator("");
  };

  const finishWorkOrderTime = () => {
    const op = operators.find((x) => x.code === codeOperator);
    if (!op) {
      alert("Codi Operari Incorrecte");
      return;
    }

    const last = workOrdertimes.find(
      (time) => time.operator.id === op.id && time.endTime === undefined
    );

    if (last) {
      const endTime = new Date();
      const totalTimeInMilliseconds =
        endTime.getTime() - last.startTime.getTime();
      const totalTimeInSeconds = Math.floor(totalTimeInMilliseconds / 1000); // Convert milliseconds to seconds
      const totalTime = `${Math.floor(totalTimeInSeconds / 3600)}h ${Math.floor(
        (totalTimeInSeconds % 3600) / 60
      )}m ${totalTimeInSeconds % 60}s`;

      const updatedTimes = workOrdertimes.map((time) =>
        time.operator.id === last.operator.id
          ? { ...time, endTime, totalTime }
          : time
      );

      setWorkOrderTimes(updatedTimes);
    } else {
      alert("Aquest Operari no està fitxat");
    }
    setCodeOperator("");
  };

  const totalTimeByOperatorId: { [id: string]: number } = {};
  workOrdertimes.forEach((time) => {
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
  // Calculate total time without operator
  const totalMilliseconds = workOrdertimes.reduce((total, time) => {
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

  return (
    <div className="mx-auto px-4 py-8 mt-12">
      <div className="flex flex-col">
        <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-400">
          <span className="text-xl font-bold">Fitxar Operari</span>
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
          />
          <button
            type="button"
            onClick={addWorkOrderTime}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={finishWorkOrderTime}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Sortir
          </button>
        </div>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
      <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-40 mt-6">
        <span className="text-xl font-bold">Temps d'Operaris</span>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workOrdertimes.map((time) => (
                <tr
                  key={time.id}
                  className={` ${
                    time.endTime === undefined ? "bg-green-300" : "bg-gray-300"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-900">
                      {formatDate(time.startTime.toLocaleString())}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg text-gray-900">
                      {formatDate(time.endTime?.toLocaleString())}
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
                  colSpan={2}
                  className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 font-bold"
                >
                  {totalFormatted}
                </td>
              </tr>
              {Object.keys(totalTimes).map((operatorId) => (
                <tr key={operatorId}>
                  <td colSpan={3}></td>
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

export default WorkOrderOperatorTimes;
