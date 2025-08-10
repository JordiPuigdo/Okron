'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useWareHouses } from 'app/hooks/useWarehouse';
import { SvgConsumeSparePart, SvgRestoreSparePart } from 'app/icons/icons';
import SparePart, {
  ConsumeSparePart,
  RestoreSparePart,
} from 'app/interfaces/SparePart';
import { WareHouseStockAvailability } from 'app/interfaces/Warehouse';
import WorkOrder, { WorkOrderSparePart } from 'app/interfaces/workOrder';
import SparePartService from 'app/services/sparePartService';
import WorkOrderService from 'app/services/workOrderService';
import { useGlobalStore, useSessionStore } from 'app/stores/globalStore';
import { formatDate } from 'app/utils/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/ui/table';
import { Button } from 'designSystem/Button/Buttons';
import Link from 'next/link';

interface ChooseSparePartsProps {
  selectedSpareParts: WorkOrderSparePart[];
  setSelectedSpareParts: React.Dispatch<
    React.SetStateAction<WorkOrderSparePart[]>
  >;
  isFinished: boolean;
  workOrder: WorkOrder;
}

const ChooseSpareParts: React.FC<ChooseSparePartsProps> = ({
  selectedSpareParts,
  setSelectedSpareParts,
  isFinished,
  workOrder,
}) => {
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const [filteredSpareParts, setFilteredSpareParts] =
    useState<WareHouseStockAvailability[]>();

  const { isModalOpen } = useGlobalStore(state => state);
  const { getStockAvailability, warehouses } = useWareHouses(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetch = async () => {
    const responseData = await getStockAvailability();
    if (responseData) setFilteredSpareParts(responseData);
  };
  useEffect(() => {
    fetch();
  }, []);

  const [unitsPerSparePart, setUnitsPerSparePart] = useState<{
    [key: string]: number;
  }>({});

  const [unitsPerSerial, setUnitsPerSerial] = useState<{
    [key: string]: number;
  }>({});
  const { operatorLogged } = useSessionStore(state => state);

  const filteredResults = useMemo(() => {
    if (!filteredSpareParts) return [];

    const searchText = searchTerm.toLowerCase();
    return filteredSpareParts.filter(sparePart =>
      [sparePart.sparePartCode, sparePart.sparePartName].some(field =>
        field?.toLowerCase().includes(searchText)
      )
    );
  }, [filteredSpareParts, searchTerm]);
  const [showModalWareHouse, setShowModalWareHouse] = useState<
    WareHouseStockAvailability | undefined
  >(undefined);

  useEffect(() => {
    if (!isModalOpen && showModalWareHouse) {
      setShowModalWareHouse(undefined);
    }
  }, [isModalOpen]);

  function checkSparePart(sparePart: WareHouseStockAvailability): boolean {
    if (operatorLogged == undefined) {
      alert('Has de tenir un operari fitxat per fer aquesta acció!');
      return false;
    }
    if (sparePart.warehouseStock.length > 1) {
      setShowModalWareHouse(sparePart);
      return true;
    }
    const currentUnits = unitsPerSparePart[sparePart.sparePartId] || 0;

    const stock = filteredSpareParts?.find(
      x => x.sparePartId == sparePart.sparePartId
    );
    if (stock?.warehouseStock && stock?.warehouseStock.length == 1) {
      if (currentUnits > stock?.warehouseStock[0].stock) {
        alert('No tens prou stock');
        return false;
      }
    }
    //if(currentUnits > )

    consumeSparePart(
      sparePart,
      currentUnits,
      sparePart.warehouseStock[0].warehouseId
    );
    return true;
  }

  const [expandedSerials, setExpandedSerials] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSerialView = (key: string) => {
    setExpandedSerials(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  function checkSparePartSerial(
    sparePart: WareHouseStockAvailability,
    sparePartSerial: string,
    units: number,
    stock: number
  ) {
    if (operatorLogged == undefined) {
      alert('Has de tenir un operari fitxat per fer aquesta acció!');
      return false;
    }
    if (units > stock) {
      alert('No tens prou stock');
    }

    consumeSparePart(
      sparePart,
      units,
      sparePart.warehouseStock[0].warehouseId,
      sparePartSerial
    );
  }

  const onSelectedId = (wareHouseId: string) => {
    const sparePart = showModalWareHouse!;
    const currentUnits = unitsPerSparePart[sparePart.sparePartId] || 0;
    if (
      sparePart.warehouseStock.filter(x => x.warehouseId == wareHouseId)[0]
        .stock < currentUnits ||
      currentUnits == null ||
      currentUnits <= 0
    ) {
      alert('No tens tant stock!');
      return;
    }
    consumeSparePart(sparePart, currentUnits, wareHouseId);
    setShowModalWareHouse(undefined);
  };

  async function consumeSparePart(
    sparePart: WareHouseStockAvailability,
    units: number,
    warehouseId: string,
    serialNumber?: string
  ) {
    if (sparePart) {
      setUnitsPerSparePart(prevUnits => ({
        ...prevUnits,
        [sparePart.sparePartId]: 0,
      }));

      const sparePartFinded = filteredSpareParts?.filter(
        x => x.sparePartId == sparePart.sparePartId
      )[0];
      if (sparePartFinded) {
        const response = sparePartFinded.warehouseStock.filter(
          x => x.warehouseId == warehouseId
        )[0];
        response.stock = response.stock - units;
      }
      //sparePart.unitsConsum = currentUnits;

      setSelectedSpareParts(prevSelected => [
        ...prevSelected,
        mapSparePartToWorkorderSparePart(
          sparePart,
          units,
          warehouseId,
          serialNumber
        ),
      ]);
      const splitedName = sparePart.sparePartName.split('-');
      const consRequest: ConsumeSparePart = {
        sparePartId: sparePart.sparePartId,
        unitsSparePart: units,
        workOrderId: workOrder.id,
        operatorId: operatorLogged?.idOperatorLogged!,
        warehouseId: warehouseId,
        workOrderCode: workOrder.code + ' - ' + workOrder.description,
        sparePartCode: splitedName[0].trim(),
        warehouseName:
          warehouses.find(x => x.id == warehouseId)?.description ?? '',
        serialNumber: serialNumber,
      };
      await sparePartService.consumeSparePart(consRequest);
      await workOrderService.cleanCache();
    } else {
      console.log('Spare part not found in the available parts list.');
    }
  }

  const mapSparePartToWorkorderSparePart = (
    sparePart: WareHouseStockAvailability,
    units: number,
    warehouseId: string,
    serialNumber?: string
  ): WorkOrderSparePart => {
    const name = sparePart.sparePartName.split('-');
    const finalSparePart = {
      id: sparePart.sparePartId,
      code: name[0],
      description: name[1],
      warehouseId: warehouseId,
      warehouses: warehouses.find(x => x.id == warehouseId),
    };
    const workOrderSparePart: WorkOrderSparePart = {
      id: sparePart.sparePartId,
      quantity: units,
      sparePart: finalSparePart as unknown as SparePart,
      warehouse: '',
      warehouseId: warehouseId,
      warehouseName:
        warehouses.find(x => x.id == warehouseId)?.description ?? '',
      serialNumber: serialNumber,
    };
    return workOrderSparePart;
  };

  async function cancelSparePartConsumption(
    sparePart: SparePart,
    quantity: number,
    wareHouseId: string,
    serialNumber?: string
  ) {
    if (operatorLogged == undefined) {
      alert('Has de tenir un operari fitxat per fer aquesta acció!');
      return;
    }
    if (quantity <= 0) {
      alert('Quantitat negativa!');
    }

    const sparePartfinded = filteredSpareParts?.find(
      x => x.sparePartId === sparePart.id
    );
    if (sparePartfinded) {
      if (sparePartfinded.warehouseStock.length > 1) {
        sparePartfinded.warehouseStock.filter(
          x => x.warehouseId == wareHouseId
        )[0].stock += quantity;
      } else {
        sparePartfinded.warehouseStock[0].stock += quantity;
      }
    }

    setSelectedSpareParts(prevSelected =>
      prevSelected.filter(x => x.sparePart.id !== sparePart.id)
    );

    const consRequest: RestoreSparePart = {
      sparePartId: sparePart.id,
      unitsSparePart: quantity,
      workOrderId: workOrder.id,
      operatorId: operatorLogged?.idOperatorLogged!,
      warehouseId: '6814816f446c684cd2af368a',
      workOrderCode: workOrder.code,
      sparePartCode: sparePart.code,
      warehouseName: '',
      serialNumber: serialNumber,
    };
    await sparePartService.restoreSparePart(consRequest);
    await workOrderService.cleanCache();
  }

  /*useEffect(() => {
    setFilteredSpareParts(availableSpareParts);
  }, [availableSpareParts]);*/

  return (
    <>
      <div className="flex flex-col flex-grow bg-white rounded-lg p-2 w-full">
        <div className="flex items-center">
          <input
            disabled={isFinished}
            type="text"
            placeholder="Buscador"
            className="p-2 mb-4 border border-gray-300 rounded-md"
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Codi - Descripció</TableHead>
                <TableHead>Magatzem Stock</TableHead>
                <TableHead>Unitats</TableHead>
                <TableHead>Accions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSpareParts &&
                filteredResults.slice(0, 5).map(sparePart => {
                  const sparePartId = sparePart.sparePartId;
                  const hasSerials = sparePart.warehouseStock.some(
                    ws => ws.serialStocks?.length > 0
                  );

                  return (
                    <React.Fragment key={sparePartId}>
                      {/* Fila padre (recambio) */}
                      <TableRow>
                        <TableCell>
                          {hasSerials && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSerialView(sparePartId)}
                            >
                              +
                            </Button>
                          )}
                        </TableCell>

                        <TableCell className="font-medium">
                          {sparePart.sparePartName}
                        </TableCell>

                        <TableCell>
                          {hasSerials ? (
                            <>
                              {sparePart.warehouseStock.map((stock, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between gap-2"
                                >
                                  <span className="border-r pr-2">
                                    {stock.warehouse}
                                  </span>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {sparePart.warehouseStock.map((stock, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between gap-2"
                                >
                                  <span className="border-r pr-2">
                                    {stock.warehouse}
                                  </span>
                                  <span className="font-semibold">
                                    {stock.stock} u.
                                  </span>
                                </div>
                              ))}
                            </>
                          )}
                        </TableCell>

                        <TableCell>
                          {hasSerials ? (
                            <>
                              {sparePart.warehouseStock.map((stock, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between gap-2"
                                >
                                  <span className="font-semibold">
                                    {stock.stock} u.
                                  </span>
                                </div>
                              ))}
                            </>
                          ) : (
                            <input
                              disabled={isFinished}
                              type="number"
                              className="p-2 border border-gray-300 rounded-md w-20"
                              onKeyPress={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                }
                              }}
                              value={
                                unitsPerSparePart[sparePart.sparePartId] || ''
                              }
                              onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                setUnitsPerSparePart(prevUnits => ({
                                  ...prevUnits,
                                  [sparePart.sparePartId]: value,
                                }));
                              }}
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          {!hasSerials && (
                            <button
                              disabled={isFinished}
                              type="button"
                              className={` ${
                                isFinished
                                  ? 'bg-gray-400'
                                  : 'bg-orange-400 hover:bg-orange-600'
                              }  text-white font-semibold p-1 rounded-md ${
                                selectedSpareParts.find(
                                  part => part.id === sparePart.sparePartId
                                ) !== undefined
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                              onClick={e => checkSparePart(sparePart)}
                            >
                              <SvgConsumeSparePart className="w-8 h-8" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>

                      {expandedSerials[sparePartId] &&
                        sparePart.warehouseStock.map(stock =>
                          stock.serialStocks?.map(serial => {
                            const serialKey = `${sparePartId}-${stock.warehouseId}-${serial.serialNumber}`;

                            return (
                              <TableRow key={serialKey} className="bg-muted/30">
                                <TableCell></TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                  Serials <strong>{serial.serialNumber}</strong>
                                </TableCell>
                                <TableCell className="font-semibold"></TableCell>
                                <TableCell className="flex items-center gap-2">
                                  <div className="flex justify-between gap-2">
                                    <span className="font-semibold">
                                      {serial.quantity} u.
                                    </span>
                                  </div>
                                  <input
                                    disabled={isFinished}
                                    type="number"
                                    className="p-2 border border-gray-300 rounded-md w-20"
                                    onKeyPress={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                      }
                                    }}
                                    value={
                                      unitsPerSerial[serial.serialNumber] || ''
                                    }
                                    onChange={e => {
                                      const value = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      setUnitsPerSerial(prevUnits => ({
                                        ...prevUnits,
                                        [serial.serialNumber]: value,
                                      }));
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <button
                                    disabled={isFinished}
                                    type="button"
                                    className={` ${
                                      isFinished
                                        ? 'bg-gray-400'
                                        : 'bg-orange-400 hover:bg-orange-600'
                                    }  text-white font-semibold p-1 rounded-md ${
                                      selectedSpareParts.find(
                                        part =>
                                          part.serialNumber ===
                                          serial.serialNumber
                                      ) !== undefined
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                    }`}
                                    onClick={e =>
                                      checkSparePartSerial(
                                        sparePart,
                                        serial.serialNumber,
                                        unitsPerSerial[serial.serialNumber] ||
                                          0,
                                        serial.quantity
                                      )
                                    }
                                  >
                                    <SvgConsumeSparePart className="w-8 h-8" />
                                  </button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <div className="text-black p-2">
          <p className="text-sm font-bold border-b-2 py-2">
            Peçes de recanvi consumides a la ordre
          </p>
          <div className="p-2">
            {selectedSpareParts.map(selectedPart => (
              <div
                key={selectedPart.id}
                className=" flex flex-row items-center gap-2"
              >
                <p className="text-blue-600 underline">
                  <Link href={`/spareParts/${selectedPart.sparePart.id}`}>
                    {selectedPart.sparePart.code}
                  </Link>
                </p>
                <p>{' - '}</p>
                <p>{formatDate(selectedPart.creationDate ?? new Date())}</p>
                <p>{' - '}</p>
                <p>{selectedPart.sparePart.description}</p>
                {selectedPart.serialNumber}
                {selectedPart.serialNumber && (
                  <>
                    <p>{' - '}</p>
                    <p className="font-semibold">{selectedPart.serialNumber}</p>
                  </>
                )}
                <p>{' - '}</p>
                <p className="font-bold">{' Unitats Consumides:'} </p>
                {selectedPart.quantity}
                <button
                  disabled={isFinished}
                  type="button"
                  className={`${
                    isFinished ? 'bg-gray-400' : ' bg-red-600 hover:bg-red-400'
                  } text-white font-semibold p-1 rounded-md`}
                  onClick={e =>
                    cancelSparePartConsumption(
                      selectedPart.sparePart,
                      selectedPart.quantity,
                      selectedPart.warehouseId,
                      selectedPart.serialNumber
                    )
                  }
                >
                  <SvgRestoreSparePart className="w-8 h-8" />
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
