"use client";

import {
  SparePartDetailRequest,
  SparePartPerAssetResponse,
} from "app/interfaces/SparePart";
import { formatDate, formatDateQuery } from "app/utils/utils";
import Link from "next/link";
import { useState } from "react";
import ca from "date-fns/locale/ca";
import DatePicker from "react-datepicker";
import SparePartService from "app/services/sparePartService";

export default function SimpleDataTable({
  title,
  sparePartId,
  assetId,
  sparePartsPerAsset,
  searchPlaceHolder,
}: {
  title: string;
  sparePartId?: string;
  assetId?: string;
  sparePartsPerAsset?: SparePartPerAssetResponse[];
  searchPlaceHolder: string;
}) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 15);

  const [startDate, setStartDate] = useState<Date | null>(currentDate);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const [sparePerMachine, setSparePartPerMachine] = useState<
    SparePartPerAssetResponse[] | null
  >(sparePartsPerAsset != null ? sparePartsPerAsset : []);

  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sparePerMachine?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sparePerMachine!.length / itemsPerPage);

  async function filterSpareParts() {
    const x: SparePartDetailRequest = {
      id: sparePartId,
      assetId: assetId,
      startDate: formatDateQuery(startDate!, true),
      endDate: formatDateQuery(endDate!, false),
    };
    const sparePartDetailResponse =
      await sparePartService.getSparePartHistoryByDates(x);
    setSparePartPerMachine(sparePartDetailResponse);
  }

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredSpareParts = sparePerMachine!.filter((sparePerMachine) => {
    return (
      sparePerMachine.asset?.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sparePerMachine.machine?.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      sparePerMachine.spareParts.some((consumes) =>
        consumes.operator.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });
  const totalUnits = filteredSpareParts?.map((sparePartPerAsset) =>
    sparePartPerAsset.spareParts.reduce(
      (total, consumes) => total + consumes.quantity,
      0
    )
  );

  const handlePaginationClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-lg p-2 my-4">
      <div className="mb-4 text-white text-lg font-semibold">{title}</div>
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
          onClick={filterSpareParts}
          className="bg-blue-500 text-white ml-4 px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 "
        >
          Filtrar per dates
        </button>
        <input
          type="text"
          placeholder={searchPlaceHolder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Equip
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Unitats
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Dia
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Operari
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Detall Ordre
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSpareParts?.map((sparePartPerMachine, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {sparePartPerMachine.machine != null
                    ? sparePartPerMachine.machine?.description
                    : sparePartPerMachine.asset?.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sparePartPerMachine.spareParts.map((consumes, index) => (
                  <div key={index} className="text-sm text-gray-900">
                    {consumes.quantity}
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sparePartPerMachine.spareParts.map((consumes, index) => (
                  <div key={index} className="text-sm text-gray-900">
                    {formatDate(consumes.creationDate, true)}
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sparePartPerMachine.spareParts.map((consumes, index) => (
                  <div key={index} className="text-sm text-gray-900">
                    {consumes.operator.name}
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sparePartPerMachine.workOrderId.length > 0 && (
                  <Link
                    href="/workOrders/[id]"
                    as={`/workOrders/${sparePartPerMachine.workOrderId}`}
                    className="flex bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                  >
                    Detall
                  </Link>
                )}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 font-semibold">
                Total Unitats Consumides
              </div>
            </td>
            {totalUnits[0] > 0 && (
              <td
                colSpan={4}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold"
              >
                {totalUnits?.reduce((total, units) => total + units, 0)}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 disabled:opacity-50"
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePaginationClick(page)}
            className={`mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 ${
              currentPage === page ? "bg-blue-600" : ""
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 disabled:opacity-50"
        >
          Següent
        </button>
      </div>
    </div>
  );
}
