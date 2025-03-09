'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ProviderToSparePartRequest from 'app/(pages)/providers/[id]/Components/ProviderToSparePartRequest';
import { useWareHouses } from 'app/hooks/useWareHouses';
import SparePart from 'app/interfaces/SparePart';
import SparePartService from 'app/services/sparePartService';
import Container from 'components/layout/Container';
import { HeaderForm } from 'components/layout/HeaderForm';
import { Button } from 'designSystem/Button/Buttons';
import { useRouter } from 'next/navigation';

import SparePartWareHouseSelected from './Components/SparePartWareHouseSelected';

interface SparePartForm {
  sparePartLoaded: SparePart | undefined;
}

const SparePartForm: React.FC<SparePartForm> = ({ sparePartLoaded }) => {
  const router = useRouter();
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ''
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<SparePart>({
    defaultValues: {},
  });
  const [sparePart, setSparePart] = useState<SparePart | null>(null);

  const { warehouses } = useWareHouses(true);

  function handleAssignWareHouse(wareHouseId: string) {
    setSparePart(prevSparePart => {
      if (!prevSparePart) return prevSparePart;
      const isAlreadyAssigned = prevSparePart.wareHouseId.includes(wareHouseId);
      const updatedWareHouseIds = isAlreadyAssigned
        ? prevSparePart.wareHouseId.filter(id => id !== wareHouseId) // Elimina el ID
        : [...prevSparePart.wareHouseId, wareHouseId]; // Agrega el ID
      setValue('wareHouseId', updatedWareHouseIds);
      return {
        ...prevSparePart,
        wareHouseId: updatedWareHouseIds,
      };
    });
  }
  function handleRemoveWareHouse(wareHouseId: string) {
    setSparePart(prevSparePart => {
      if (!prevSparePart) return prevSparePart;
      const updatedWareHouseIds = prevSparePart.wareHouseId.filter(
        id => id !== wareHouseId
      );
      setValue('wareHouseId', updatedWareHouseIds);
      return {
        ...prevSparePart,
        wareHouseId: updatedWareHouseIds,
      };
    });
  }

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        setValue('id', sparePartLoaded!.id);
        setValue('code', sparePartLoaded!.code);
        setValue('description', sparePartLoaded!.description);
        setValue('ubication', sparePartLoaded!.ubication);
        setValue('refProvider', sparePartLoaded!.refProvider);
        setValue('family', sparePartLoaded!.family);
        setValue('brand', sparePartLoaded!.brand);
        setValue('stock', sparePartLoaded!.stock);
        setValue('price', sparePartLoaded!.price);
        setValue('active', sparePartLoaded!.active);
        setSparePart(sparePart);
      } catch (error) {
        setShowErrorMessage(true);
      }
    };
    if (sparePartLoaded) {
      fetchSparePart();
    } else {
      if (sparePart == null) createSparePart();
    }
  }, [SparePartForm, setValue]);

  function createSparePart() {
    const newSparePart: SparePart = {
      id: '',
      code: '',
      description: '',
      refProvider: '',
      family: '',
      ubication: '',
      stock: 0,
      brand: '',
      unitsConsum: 0,
      price: 0,
      active: true,
      documentation: [],
      minium: 0,
      maximum: 0,
      colorRow: '',
      lastMovementConsume: new Date(),
      lastMovement: new Date(),
      lastRestockDate: new Date(),
      wareHouseId: [],
      providers: [],
    };
    setSparePart(newSparePart);
  }

  const onSubmit = async (sparePart: SparePart) => {
    if (sparePartLoaded) {
      await sparePartService
        .updateSparePart(sparePart)
        .then(spare => {
          if (spare) {
            setShowSuccessMessage(true);
            setTimeout(() => {
              history.back();
            }, 2000);
          }
        })
        .catch(error => {
          setShowErrorMessage(true);
        });
    } else {
      await sparePartService
        .createSparePart(sparePart)
        .then(spare => {
          if (spare) {
            setShowSuccessMessage(true);
            setTimeout(() => {
              history.back();
            }, 2000);
          }
        })
        .catch(error => {
          setShowErrorMessage(true);
        });
    }
  };

  function handleBack() {
    router.back();
  }

  return (
    <Container>
      <HeaderForm header="Crear Recanvi" isCreate />
      <div className="flex flex-col bg-white p-6 rounded-md shadow-md my-4 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 p-4 border rounded-md"
          >
            <h2 className="font-semibold mb-2">Nou Recanvi</h2>
            <div className="flex flex-row gap-4 items-start w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Codi
                </label>
                <input
                  {...register('code')}
                  id="code"
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({ ...sparePart!, code: e.target.value })
                  }
                />
              </div>

              <div className="flex-grow mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Descripció
                </label>
                <input
                  {...register('description')}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({ ...sparePart!, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-start w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Ubicació
                </label>
                <input
                  {...register('ubication')}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({ ...sparePart!, ubication: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Ref Proveïdor
                </label>
                <input
                  {...register('refProvider')}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({ ...sparePart!, refProvider: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-start w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Stock Min
                </label>
                <input
                  {...register('minium')}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({
                      ...sparePart!,
                      minium: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Stock Max
                </label>
                <input
                  {...register('maximum')}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({
                      ...sparePart!,
                      maximum: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 items-start w-full">
              <div className="flex-grow mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Família
                </label>
                <input
                  {...register('family')}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  onChange={e =>
                    setSparePart({ ...sparePart!, family: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Actiu
                </label>
                <input
                  type="checkbox"
                  {...register('active')}
                  checked={true}
                  className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
          </form>
          <div className="border rounded-md p-2">
            <h2 className="font-semibold mb-2">Selecciona Magatzem</h2>

            <div>
              <SparePartWareHouseSelected
                handleAssignWareHouse={handleAssignWareHouse}
              />
              {warehouses
                .filter(x => sparePart?.wareHouseId.includes(x.id))
                .map(x => (
                  <div key={x.id} className="border p-2 rounded-md">
                    {x.code} - {x.description}
                    <Button
                      type="delete"
                      className="ml-2"
                      onClick={() => handleRemoveWareHouse(x.id)}
                    >
                      -
                    </Button>
                  </div>
                ))}
            </div>
          </div>
          <div className="border rounded-md p-2">
            <h2 className="font-semibold mb-2">Selecciona Proveïdor</h2>
            <ProviderToSparePartRequest
              sparePart={sparePart!}
              setSparePart={setSparePart}
            />
            {sparePart?.providers.map(x => (
              <div key={x.providerId}>
                {x.provider?.name} - {x.provider?.city} Preu: {x.price}€
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            onClick={() => onSubmit(sparePart!)}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-500 text-white ml-4 px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
          >
            Cancelar
          </button>

          {showSuccessMessage && (
            <p className="mt-4 text-green-600">
              Recanvi actualitzat correctament!
            </p>
          )}
          {showErrorMessage && (
            <p className="mt-4 text-red-600">Error actualitzant el recanvi.</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SparePartForm;
