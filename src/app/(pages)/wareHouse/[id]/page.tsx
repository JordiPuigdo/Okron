'use client';
import { useEffect, useState } from 'react';
import { useSparePartsHook } from 'app/hooks/useSparePartsHook';
import { useWareHouses } from 'app/hooks/useWareHouses';
import { SvgSpinner } from 'app/icons/icons';
import SparePart from 'app/interfaces/SparePart';
import { WareHouse, WareHouseStock } from 'app/interfaces/WareHouse';
import { useSessionStore } from 'app/stores/globalStore';
import Container from 'components/layout/Container';
import { HeaderForm } from 'components/layout/HeaderForm';
import MainLayout from 'components/layout/MainLayout';
import { Button } from 'designSystem/Button/Buttons';
import { useRouter } from 'next/navigation';

import SparePartsList from './Components/SparePartWareHouseList';

export default function wareHouseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [wareHouse, setWareHouse] = useState<WareHouse>();
  const [wareHouseStock, setWareHouseStock] = useState<WareHouseStock[]>();
  const router = useRouter();
  const { operatorLogged } = useSessionStore();
  const {
    getWareHouse,
    addSparePart,
    removeSparePart,
    updateWareHouse,
    isLoadingWareHouse,
    isWareHouseSuccessFull,
    warehouses,
  } = useWareHouses(true);
  const { spareParts } = useSparePartsHook(true);

  async function fetch() {
    const wareHouseData = await getWareHouse(params.id);
    setWareHouse(wareHouseData);
    setWareHouseStock(wareHouseData.stock);
  }
  useEffect(() => {
    fetch();
  }, []);

  function handleUpdate() {
    if (
      warehouses.find(
        x =>
          x.code.toLocaleUpperCase() == wareHouse?.code.toLocaleUpperCase() &&
          x.id != params.id
      )
    ) {
      alert('El codi ja existeix');
      return;
    }
    updateWareHouse({
      id: params.id,
      code: wareHouse!.code,
      description: wareHouse!.description,
    });
  }

  function handleAssignSparePart(sparePart: SparePart) {
    if (wareHouseStock?.find(stock => stock.sparePartId === sparePart.id))
      return;
    const newWareHouseStock: WareHouseStock = {
      sparePartId: sparePart.id,
      quantity: 1,
      sparePart: sparePart,
    };

    setWareHouseStock(prevStock => [...(prevStock || []), newWareHouseStock]);
    addSparePart({
      operatorId: operatorLogged ? operatorLogged.idOperatorLogged : '',
      wareHouseId: params.id,
      sparePartId: sparePart.id,
    });
  }
  function handleDeleteAssigned(sparePart: SparePart) {
    setWareHouseStock(prevStock =>
      prevStock?.filter(stock => stock.sparePartId !== sparePart.id)
    );
    removeSparePart({
      operatorId: operatorLogged ? operatorLogged.idOperatorLogged : '',
      wareHouseId: params.id,
      sparePartId: sparePart.id,
    });
  }

  return (
    <MainLayout>
      <Container className="flex flex-col">
        {wareHouse && (
          <>
            <HeaderForm
              isCreate={false}
              header={`${wareHouse?.code} - ${wareHouse?.description}`}
            />
            <div className="flex flex-col w-full h-full bg-white p-6 rounded-md shadow-md my-4 gap-6 ">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 flex-1">
                <div className="flex flex-col gap-2 border p-4 rounded-md">
                  <label className="font-semibold">Codi</label>
                  <input
                    className="border p-2 rounded-md"
                    type="text"
                    value={wareHouse?.code}
                    onChange={e =>
                      setWareHouse({ ...wareHouse, code: e.target.value })
                    }
                  />
                  <label className="font-semibold mt-2">Descripció</label>
                  <input
                    className="border p-2 rounded-md"
                    type="text"
                    value={wareHouse?.description}
                    onChange={e =>
                      setWareHouse({
                        ...wareHouse,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                {/*<div className="flex w-full flex-col border p-4 rounded-md">
                  <h2 className="font-semibold mb-2">Stock Recanvis</h2>
                  {spareParts && (
                    <SparePartsList
                      handleAssignSparePart={handleAssignSparePart}
                      spareParts={spareParts.filter(
                        x =>
                          !wareHouseStock
                            ?.map(x => x.sparePartId)
                            .includes(x.id)
                      )}
                    />
                  )}
                </div>
                <div className="flex w-full flex-col border p-4 rounded-md">
                  <h2 className="font-semibold mb-2">Recanvis Assignats</h2>
                  {wareHouseStock && (
                    <SparePartsList
                      handleAssignSparePart={handleDeleteAssigned}
                      spareParts={wareHouseStock.map(x => x.sparePart)}
                      assignButton={false}
                    />
                  )}
                </div>*/}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="create"
                  customStyles={`flex items-center gap-2 ${
                    isWareHouseSuccessFull && 'bg-green-500'
                  }`}
                  onClick={handleUpdate}
                >
                  Guardar{' '}
                  {isLoadingWareHouse && <SvgSpinner className="ml-2" />}
                </Button>
                <Button
                  onClick={() => router.back()}
                  type="cancel"
                  customStyles="gap-2 flex"
                >
                  Cancelar
                </Button>
              </div>
            </div>
            <div className="flex flex-col w-full h-full bg-white p-6 rounded-md shadow-md my-4 gap-6 ">
              Llistat de Recanvis (Moviments stock x recanvi)
            </div>
            <div className="flex flex-col w-full h-full bg-white p-6 rounded-md shadow-md my-4 gap-6 ">
              Llistat de Moviments Stock
            </div>
          </>
        )}
      </Container>
    </MainLayout>
  );
}
