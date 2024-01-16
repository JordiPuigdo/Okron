"use client";

import Layout from "components/Layout";
import SparePart from "interfaces/SparePart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SparePartService from "services/sparePartService";

export default function EditSparePart({ params }: { params: { id: string } }) {
  const router = useRouter();
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
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

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const sparePart = await sparePartService.getSparePart(params.id);
        /*Object.entries(sparePart).forEach(([key, value]) => {
          const typedKey = key as keyof SparePart;
          setValue(typedKey, value[typedKey]);
        });*/
        setValue("id", sparePart.id);
        setValue("code", sparePart.code);
        setValue("description", sparePart.description);
        setValue("ubication", sparePart.ubication);
        setValue("refProvider", sparePart.refProvider);
        setValue("family", sparePart.family);
        setValue("brand", sparePart.brand);
        setValue("stock", sparePart.stock);
        setSparePart(sparePart);
      } catch (error) {
        setShowErrorMessage(true);
      }
    };

    fetchSparePart();
  }, [params.id, setValue]);

  const onSubmit = async (sparePart: SparePart) => {
    await sparePartService
      .updateSparePart(sparePart)
      .then((spare) => {
        if (spare) {
          setShowSuccessMessage(true);
          setTimeout(() => {
            history.back();
          }, 2000);
        }
      })
      .catch((error) => {
        setShowErrorMessage(true);
      });
  };

  function handleBack() {
    router.back();
  }
  if (!sparePart) return <>Carregant dades</>;
  if (sparePart)
    return (
      <Layout>
        <div className="w-full mx-auto p-4 bg-white rounded-md shadow-md text-black">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Codi
              </label>
              <input
                {...register("code")}
                id="code"
                type="text"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Descripció
              </label>
              <input
                {...register("description")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ubicació
              </label>
              <input
                {...register("ubication")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Ref Proveïdor
              </label>
              <input
                {...register("refProvider")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Família
              </label>
              <input
                {...register("family")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Stock
              </label>
              <input
                {...register("stock")}
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
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
              <p className="mt-4 text-red-600">
                Error actualitzant el recanvi.
              </p>
            )}
          </form>
        </div>
      </Layout>
    );
}
