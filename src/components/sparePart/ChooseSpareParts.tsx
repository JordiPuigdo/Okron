"use client";

import SparePart, {
  ConsumeSparePart,
  RestoreSparePart,
} from "app/interfaces/SparePart";
import { WorkOrderSparePart } from "app/interfaces/workOrder";
import { useEffect, useState } from "react";
import SparePartService from "app/services/sparePartService";
import { checkOperatorCreated, isOperatorLogged } from "app/utils/utils";
import { useSessionStore } from "app/stores/globalStore";
import WorkOrderService from "app/services/workOrderService";

interface ChooseSparePartsProps {
  availableSpareParts: SparePart[];
  selectedSpareParts: WorkOrderSparePart[];
  setSelectedSpareParts: React.Dispatch<
    React.SetStateAction<WorkOrderSparePart[]>
  >;
  WordOrderId: string;
  isFinished: boolean;
}

const ChooseSpareParts: React.FC<ChooseSparePartsProps> = ({
  availableSpareParts,
  selectedSpareParts,
  setSelectedSpareParts,
  WordOrderId,
  isFinished,
}) => {
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [filteredSpareParts, setFilteredSpareParts] = useState<SparePart[]>(
    availableSpareParts.filter((x) => x.active)
  );
  const sparePartsLimit = 5;
  const [unitsPerSparePart, setUnitsPerSparePart] = useState<{
    [key: string]: number;
  }>({});
  const { operatorLogged } = useSessionStore((state) => state);

  const filterSpareParts = (searchTerm: string) => {
    const filtered = availableSpareParts.filter((sparePart) => {
      const searchText = searchTerm.toLowerCase();
      if (sparePart.active) {
        return [
          sparePart.code,
          sparePart.description,
          sparePart.refProvider,
          sparePart.family,
          sparePart.ubication,
        ].some((field) => field && field.toLowerCase().includes(searchText));
      }
    });

    setFilteredSpareParts(filtered);
  };

  async function consumeSparePart(sparePart: SparePart) {
    if (operatorLogged == undefined) {
      alert("Has de tenir un operari fitxat per fer aquesta acció!");
      return;
    }
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
        operatorId: operatorLogged?.idOperatorLogged!,
      };
      await sparePartService.consumeSparePart(consRequest);
      await workOrderService.cleanCache();
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
    if (operatorLogged == undefined) {
      alert("Has de tenir un operari fitxat per fer aquesta acció!");
      return;
    }
    if (quantity <= 0) {
      alert("Quantitat negativa!");
    }

    const sparePartfinded = filteredSpareParts.find(
      (x) => x.id === sparePart.id
    );
    if (sparePartfinded) {
      sparePartfinded.stock += quantity;
    }

    setSelectedSpareParts((prevSelected) =>
      prevSelected.filter((x) => x.sparePart.id !== sparePart.id)
    );

    const consRequest: RestoreSparePart = {
      sparePartId: sparePart.id,
      unitsSparePart: quantity,
      workOrderId: WordOrderId,
      operatorId: operatorLogged?.idOperatorLogged!,
    };
    await sparePartService.restoreSparePart(consRequest);
    await workOrderService.cleanCache();
  }

  useEffect(() => {
    setFilteredSpareParts(availableSpareParts);
  }, [availableSpareParts]);

  return (
    <>
      <div className="mx-auto py-8 bg-white rounded-lg">
        <div className="flex items-center gap-6 px-4">
          <span className="text-xl font-bold mb-4">
            Seleccionar peçes de recanvi a consumir
          </span>
          <input
            disabled={isFinished}
            type="text"
            placeholder="Buscador"
            className="p-3 mb-4 border border-gray-300 rounded-md"
            onChange={(e) => filterSpareParts(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-red-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Codi
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Descripció
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Proveïdor
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Família
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Ubicació
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Unitats
                </th>
                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Accions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSpareParts
                .filter((x) => x.active)
                .slice(0, sparePartsLimit)
                .map((sparePart) => (
                  <tr key={sparePart.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePart.code}
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-all">
                      {sparePart.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePart.refProvider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePart.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-all">
                      {sparePart.family}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sparePart.ubication}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        disabled={isFinished}
                        type="number"
                        className="p-2 border border-gray-300 rounded-md w-20"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
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
                        disabled={isFinished}
                        type="button"
                        className={` ${
                          isFinished
                            ? "bg-gray-400"
                            : "bg-orange-400 hover:bg-orange-600"
                        } ml-4 text-white font-semibold py-2 px-4 rounded-md ${
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
          <span className="text-xl font-bold">
            Peçes de recanvi consumides a la ordre
          </span>
          <div className="mt-6">
            {selectedSpareParts.map((selectedPart) => (
              <div key={selectedPart.id} className="mb-2 text-black">
                <span>{selectedPart.sparePart.code}</span>
                <span>{" - "}</span>
                <span>{selectedPart.sparePart.description}</span>
                <span>{" - "}</span>
                <span className="font-bold">{" Unitats Consumides:"} </span>
                {selectedPart.quantity}
                <button
                  disabled={isFinished}
                  type="button"
                  className={`${
                    isFinished ? "bg-gray-400" : " bg-red-600 hover:bg-red-400"
                  }ml-4 text-white font-semibold py-2 px-4 rounded-md`}
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
      </div>
    </>
  );
};

export default ChooseSpareParts;
