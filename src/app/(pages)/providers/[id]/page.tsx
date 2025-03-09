'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SparePartsList from 'app/(pages)/wareHouse/[id]/Components/SparePartWareHouseList';
import { useProviders } from 'app/hooks/useProviders';
import { SvgSpinner } from 'app/icons/icons';
import { Provider, UpdateProviderRequest } from 'app/interfaces/Provider';
import SparePart from 'app/interfaces/SparePart';
import Container from 'components/layout/Container';
import { HeaderForm } from 'components/layout/HeaderForm';
import MainLayout from 'components/layout/MainLayout';
import { Button } from 'designSystem/Button/Buttons';
import { useRouter } from 'next/navigation';

import SparePartProviderRequest from './Components/SparePartProviderRequest';

export default function ProvidersPageDetail({
  params,
}: {
  params: { id: string };
}) {
  const [provider, setProvider] = useState<Provider>();

  const {
    getById,
    updateProvider,
    addOrRemoveSparePart,
    isLoadingProvider,
    isProviderSuccessFull,
  } = useProviders(false);
  const router = useRouter();

  async function fetch() {
    const providerData = await getById(params.id);
    setProvider(providerData);
    if (providerData) {
      Object.keys(providerData).forEach(key => {
        const value = providerData[key as keyof Provider];

        const formattedValue =
          typeof value === 'boolean'
            ? value.toString()
            : value instanceof Date
            ? value.toISOString()
            : value;

        setValue(key as keyof UpdateProviderRequest, formattedValue as string);
      });
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProviderRequest>();

  const onSubmit = async (data: UpdateProviderRequest) => {
    try {
      await updateProvider(data);
    } catch (error) {
      console.error('Error creating provider:', error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  /*function handleAssignSparePart(sparePart: SparePart) {
    if (provider?.providerSpareParts?.find(x => x.sparePartId === sparePart.id))
      return;
    addOrRemoveSparePart(params.id, {
      sparePartId: sparePart.id,
      price: 0,
    });
    setProvider(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        providerSpareParts: [
          ...(prev.providerSpareParts || []),
          { sparePartId: sparePart.id, price: 0, sparePart: sparePart },
        ],
      };
    });
  }*/

  /*function handleUnAssign(sparePart: SparePart) {
    addOrRemoveSparePart(params.id, {
      sparePartId: sparePart.id,
      price: 0,
    });
    setProvider(prev => {
      if (!prev) return prev;

      const updatedSpareParts = prev.providerSpareParts?.filter(
        item => item.sparePart.id !== sparePart.id
      );

      return {
        ...prev,
        providerSpareParts: updatedSpareParts,
      };
    });
  }*/

  return (
    <MainLayout>
      <Container>
        {provider && (
          <>
            <HeaderForm
              isCreate={false}
              header={`${provider?.name} - ${provider?.phoneNumber}`}
            />
            <div className="flex flex-col bg-white p-6 rounded-md shadow-md my-4 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <form className="space-y-4 p-4 border rounded-md">
                  <div>
                    <label className="block font-medium">Nom</label>
                    <input
                      {...register('name', {
                        required: 'El nombre es obligatorio',
                      })}
                      className="w-full border rounded p-2"
                      placeholder="Nombre del proveedor"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">NIE</label>
                    <input
                      {...register('nie', {
                        required: 'El NIE es obligatori',
                      })}
                      className="w-full border rounded p-2"
                      placeholder="NIE del proveeïdor"
                    />
                    {errors.nie && (
                      <p className="text-red-500 text-sm">
                        {errors.nie.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium">Direcció</label>
                    <input
                      {...register('address', {
                        required: 'La direcció és obligatòria',
                      })}
                      className="w-full border rounded p-2"
                      placeholder="Direcció"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium">Ciutat</label>
                      <input
                        {...register('city', {
                          required: 'La ciudad es obligatoria',
                        })}
                        className="w-full border rounded p-2"
                        placeholder="Ciudad"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium">Provincia</label>
                      <input
                        {...register('province', {
                          required: 'La provincia es obligatoria',
                        })}
                        className="w-full border rounded p-2"
                        placeholder="Provincia"
                      />
                      {errors.province && (
                        <p className="text-red-500 text-sm">
                          {errors.province.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium">Codi Postal</label>
                      <input
                        {...register('postalCode', {
                          required: 'El codi postal es obligatori',
                        })}
                        className="w-full border rounded p-2"
                        placeholder="Codi Postal"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium">Telèfon</label>
                      <input
                        {...register('phoneNumber', {
                          required: 'El telèfon es obligatori',
                        })}
                        className="w-full border rounded p-2"
                        placeholder="Telèfon"
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium">Email</label>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'El email es obligatorio',
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Formato de email inválido',
                          },
                        })}
                        className="w-full border rounded p-2"
                        placeholder="Email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium">WhatsApp</label>
                      <input
                        {...register('whatsappNumber')}
                        className="w-full border rounded p-2"
                        placeholder="Número de WhatsApp"
                      />
                    </div>
                  </div>
                </form>

                {/*<div className="border p-4 rounded-md">
                  <h2 className="font-semibold mb-2">Afegir Recanvi</h2>
                  <SparePartProviderRequest handleAssignSparePart={() => {}} />
                  <div className="pt-4">
                    <h2 className="font-semibold mb-2 border-t pt-4">
                      Recanvis Assignats
                    </h2>
                    {provider.providerSpareParts &&
                      provider.providerSpareParts.length > 0 && (
                        <SparePartsList
                          spareParts={provider.providerSpareParts.map(
                            x => x.sparePart
                          )}
                          handleAssignSparePart={handleUnAssign}
                          assignButton={false}
                        />
                      )}
                  </div>
                </div>*/}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="create"
                  customStyles={`gap-2 flex ${
                    isProviderSuccessFull && 'bg-green-500'
                  }`}
                  onClick={handleSubmit(onSubmit)}
                >
                  Guardar {isLoadingProvider && <SvgSpinner />}
                </Button>
                <Button
                  onClick={() => router.back()}
                  type="cancel"
                  customStyles="gap-2 flex"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <h3 className="font-semibold mb-2">
                Llistat de Recanvis Assignats
              </h3>
              {provider?.providerSpareParts?.map(x => (
                <div key={x.sparePartId}>
                  {x.sparePart?.code} - {x.sparePart?.description} Preu:{' '}
                  {x.price} €
                </div>
              ))}
            </div>
            <div>Històric de Comandes (comandes i recpecions)</div>
          </>
        )}
      </Container>
    </MainLayout>
  );
}
