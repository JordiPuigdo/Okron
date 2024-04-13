import { SvgSpinner } from "app/icons/icons";
import WorkOrder, {
  SearchWorkOrderFilters,
  StateWorkOrder,
} from "app/interfaces/workOrder";
import WorkOrderService from "app/services/workOrderService";
import DatePicker from "react-datepicker";
import {
  formatDate,
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import Link from "next/link";
import { useState } from "react";
import ca from "date-fns/locale/ca";

export default function TableWorkOrdersPerAsset({
  assetId,
}: {
  assetId: string;
}) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[] | []>([]);

  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const filteredWorkOrders = workOrders;
  const [message, setMessage] = useState<string>("");

  const searchWorkOrders = async () => {
    const startDateTime = startDate ? new Date(startDate) : null;
    const endDateTime = endDate ? new Date(endDate) : null;

    if (startDateTime) {
      startDateTime.setHours(0, 0, 0, 0);
    }

    if (endDateTime) {
      endDateTime.setHours(23, 59, 59, 999);
    }
    const search: SearchWorkOrderFilters = {
      assetId: assetId,
      startDateTime: startDateTime
        ? new Date(
            startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000
          ).toISOString()
        : "",
      endDateTime: endDateTime
        ? new Date(
            endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000
          ).toISOString()
        : "",
    };
    const workOrders = await workOrderService.getWorkOrdersWithFilters(search);
    if (workOrders.length == 0) {
      setMessage("No hi ha ordres disponibles amb aquests filtres");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    setWorkOrders(workOrders);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    await searchWorkOrders();
    setIsLoading(false);
  };

  return (
    <div className="overflow-x-auto mt-6 bg-gray-400 p-4 rounded-lg mb-6">
      <div className="mb-4 text-white text-lg font-semibold">
        Ordres de treball creades
      </div>
      <div className="flex items-center space-x-4 pb-4">
        <span className="text-white pr-3">Data Inici:</span>

        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          locale={ca}
          className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
        />

        <span className="text-white pr-3">Data Fi:</span>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          locale={ca}
          className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
        />

        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
          onClick={(e) => handleSearch()}
        >
          Filtrar per dates
          {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
        </button>
        {message != "" && <span className="text-red-500 ml-4">{message}</span>}
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3 text-left">Núm. Sèrie</th>
            <th className="border p-3 text-left">Descripció</th>
            <th className="border p-3 text-left">Data Inici</th>
            <th className="border p-3 text-left">Equip</th>
            <th className="border p-3 text-left">Estat</th>
            <th className="border p-3 text-left">Tipus</th>
            <th className="border p-3 text-left">Accions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorkOrders.map((order, index) => (
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
              <td className="border p-3">{order.asset?.description}</td>
              <td className="border p-3">
                {translateStateWorkOrder(order.stateWorkOrder)}
              </td>
              <td className="border p-3">
                {translateWorkOrderType(order.workOrderType)}
              </td>
              <td className="border p-3 flex space-x-2 items-center">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
