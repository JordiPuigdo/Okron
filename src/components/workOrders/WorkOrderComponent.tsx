"use client";
import { useSessionStore } from "app/stores/globalStore";
import { useEffect, useState } from "react";
import WorkOrderService from "app/services/workOrderService";
import WorkOrder, {
  SearchWorkOrderFilters,
  StateWorkOrder,
} from "app/interfaces/workOrder";
import Link from "next/link";
import {
  formatDate,
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import { SvgSpinner } from "app/icons/icons";

export default function WorkOrderComponent() {
  const { operatorLogged } = useSessionStore((state) => state);
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [workOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [workOrdersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getWorkOrders() {
      if (operatorLogged) {
        const searchFilter: SearchWorkOrderFilters = {
          machineId: "",
          operatorId: operatorLogged.idOperatorLogged,
        };

        await workOrderService
          .getWorkOrdersWithFilters(searchFilter)
          .then((response) => {
            setWorkOrders(response);
          })
          .catch((error: any) => {
            console.error("Error fetching work orders:", error);
          });
      } else {
        setWorkOrders([]);
      }
    }

    getWorkOrders();
  }, [operatorLogged]);

  const indexOfLastWorkOrder = currentPage * workOrdersPerPage;
  const indexOfFirstWorkOrder = indexOfLastWorkOrder - workOrdersPerPage;
  const currentWorkOrders = workOrders.slice(
    indexOfFirstWorkOrder,
    indexOfLastWorkOrder
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (currentWorkOrders.length > 0)
    return (
      <>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-left">Núm. Sèrie</th>
              <th className="border p-3 text-left">Descripció</th>
              <th className="border p-3 text-left">Data Inici</th>
              <th className="border p-3 text-left">Màquina</th>
              <th className="border p-3 text-left">Estat</th>
              <th className="border p-3 text-left">Tipus</th>
              <th className="border p-3 text-left">Accions</th>
            </tr>
          </thead>
          <tbody>
            {currentWorkOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`
                    ${
                      order.stateWorkOrder === StateWorkOrder.OnGoing
                        ? "bg-green-300"
                        : order.stateWorkOrder === StateWorkOrder.Waiting
                        ? "bg-orange-300"
                        : order.stateWorkOrder === StateWorkOrder.Finished
                        ? "bg-purple-300"
                        : index % 2 === 0
                        ? "bg-gray-100"
                        : "bg-white hover:bg-gray-50"
                    }
                    
                  `}
              >
                <td className="border p-3">{order.code}</td>
                <td className="border p-3">{order.description}</td>
                <td className="border p-3">{formatDate(order.startTime)}</td>
                <td className="border p-3">{order.machine?.name}</td>
                <td className="border p-3">
                  {translateStateWorkOrder(order.stateWorkOrder)}
                </td>
                <td className="border p-3">
                  {translateWorkOrderType(order.workOrderType)}
                </td>
                <td className="border p-3 flex space-x-2 items-center">
                  {order.stateWorkOrder == StateWorkOrder.Finished ? (
                    <Link
                      href="/workOrders/[id]"
                      as={`/workOrders/${order.id}`}
                      onClick={(e) => setIsLoading(true)}
                    >
                      <button className="flex bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                        Detall
                        {isLoading && (
                          <SvgSpinner style={{ marginLeft: "0.5rem" }} />
                        )}
                      </button>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/workOrders/[id]"
                        as={`/workOrders/${order.id}`}
                      >
                        <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                          Editar
                        </button>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          {Array.from(
            { length: Math.ceil(workOrders.length / workOrdersPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 border ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                } rounded-md`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </>
    );
  else return <div></div>;
}
