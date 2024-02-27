"use client";

import MainLayout from "components/layout/MainLayout";
import SparePart from "app/interfaces/SparePart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SparePartService from "components/services/sparePartService";
import Container from "components/layout/Container";

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

  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row mb-6">
        <div
          className="cursor-pointer mb-4 sm:mb-0"
          onClick={() => router.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 inline-block mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-black mx-auto">
          {sparePart?.code} - {sparePart?.description}
        </h2>
      </div>
    );
  };
  if (!sparePart) return <>Carregant dades</>;
  if (sparePart)
    return (
      <MainLayout>
        <Container>
          {renderHeader()}
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
        </Container>
      </MainLayout>
    );
}
