"use client";

import SparePart, {
  ConsumeSparePart,
  RestoreSparePart,
} from "interfaces/SparePart";
import { WorkOrderSparePart } from "interfaces/workOrder";
import { useEffect, useState } from "react";
import SparePartService from "services/sparePartService";

interface ChooseSparePartsProps {
  availableSpareParts: SparePart[];
  selectedSpareParts: WorkOrderSparePart[];
  setSelectedSpareParts: React.Dispatch<
    React.SetStateAction<WorkOrderSparePart[]>
  >;
  WordOrderId: string;
}

const ChooseSpareParts: React.FC<ChooseSparePartsProps> = ({
  availableSpareParts,
  selectedSpareParts,
  setSelectedSpareParts,
  WordOrderId,
}) => {
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [filteredSpareParts, setFilteredSpareParts] =
    useState<SparePart[]>(availableSpareParts);
  const sparePartsLimit = 5;
  const [unitsPerSparePart, setUnitsPerSparePart] = useState<{
    [key: string]: number;
  }>({});

  const filterSpareParts = (searchTerm: string) => {
    const filtered = availableSpareParts.filter((sparePart) => {
      const searchText = searchTerm.toLowerCase();

      return [
        sparePart.code,
        sparePart.description,
        sparePart.refProvider,
        sparePart.family,
        sparePart.ubication,
      ].some((field) => field && field.toLowerCase().includes(searchText));
    });

    setFilteredSpareParts(filtered);
  };

  const x = selectedSpareParts;
  debugger;

  async function consumeSparePart(sparePart: SparePart) {
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

      setSelectedSpareParts((prevSelected) => [
        ...prevSelected,
        mapSparePartToWorkorderSparePart(sparePart, currentUnits),
      ]);

      const consRequest: ConsumeSparePart = {
        sparePartId: sparePart.id,
        unitsSparePart: currentUnits,
        workOrderId: WordOrderId,
      };
      await sparePartService.consumeSparePart(consRequest);
    } else {
      console.log("Spare part not found in the available parts list.");
    }
  }

  const mapSparePartToWorkorderSparePart = (
    sparePart: SparePart,
    units: number
  ): WorkOrderSparePart => {
    const workOrderSparePart: WorkOrderSparePart = {
      id: sparePart.id,
      quantity: units,
      sparePart: sparePart,
    };
    return workOrderSparePart;
  };

  async function cancelSparePartConsumption(
    sparePart: SparePart,
    quantity: number
  ) {
    if (quantity <= 0) {
      alert("Quantitat negativa!");
    }

    // Find the spare part in the availableSpareParts array by its ID
    const foundSparePartIndex = availableSpareParts.findIndex(
      (sparePart) => sparePart.id === sparePart.id
    );

    // Check if the spare part is found
    if (foundSparePartIndex !== -1) {
      // Update the stock of the found spare part
      availableSpareParts[foundSparePartIndex].stock += quantity;
    } else {
      console.log("Spare part not found in the available parts list.");
    }

    setSelectedSpareParts((prevSelected) =>
      prevSelected.filter((selectedPart) => selectedPart.id !== sparePart.id)
    );

    const consRequest: RestoreSparePart = {
      sparePartId: sparePart.id,
      unitsSparePart: quantity,
      workOrderId: WordOrderId,
    };
    await sparePartService.restoreSparePart(consRequest);
  }

  useEffect(() => {
    setFilteredSpareParts(availableSpareParts);
  }, [availableSpareParts]);

  return (
    <>
      <div className="mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          Seleccionar peçes de recanvi a consumir
        </h1>
        <input
          type="text"
          placeholder="Buscador"
          className="p-3 mb-4 border border-gray-300 rounded-md"
          onChange={(e) => filterSpareParts(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Codi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripció
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveïdor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Família
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicació
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unitats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSpareParts.slice(0, sparePartsLimit).map((sparePart) => (
                <tr key={sparePart.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sparePart.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sparePart.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sparePart.refProvider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sparePart.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sparePart.family}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sparePart.ubication}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      className="p-2 border border-gray-300 rounded-md w-20"
                      value={unitsPerSparePart[sparePart.id] || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setUnitsPerSparePart((prevUnits) => ({
                          ...prevUnits,
                          [sparePart.id]: value,
                        }));
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      disabled={
                        selectedSpareParts.find(
                          (part) => part.id === sparePart.id
                        ) !== undefined
                      }
                      type="button"
                      className={`ml-4 bg-orange-400 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md ${
                        selectedSpareParts.find(
                          (part) => part.id === sparePart.id
                        ) !== undefined
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => consumeSparePart(sparePart)}
                    >
                      Consumir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-black ml-4 mt-8">
          <h1 className="text-2xl font-bold mb-4">
            Peçes de recanvi consumides a la ordre
          </h1>

          {selectedSpareParts.map((selectedPart) => (
            <div key={selectedPart.id} className="mb-2 text-black">
              <span>{selectedPart.sparePart.code}</span>
              <span>{" - "}</span>
              <span>{selectedPart.sparePart.description}</span>
              <span>{" - "}</span>
              <span className="font-bold">{" Unitats Consumides:"} </span>
              {selectedPart.quantity}
              <button
                type="button"
                className="ml-4 bg-red-600 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded-md"
                onClick={(e) =>
                  cancelSparePartConsumption(
                    selectedPart.sparePart,
                    selectedPart.quantity
                  )
                }
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChooseSpareParts;
