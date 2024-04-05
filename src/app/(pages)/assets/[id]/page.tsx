"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import AssetService from "app/services/assetService";
import { Asset, UpdateAssetRequest } from "app/interfaces/Asset";
import { SvgSpinner } from "app/icons/icons";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import { useRouter } from "next/navigation";
import useRoutes from "app/utils/useRoutes";

export default function AssetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [level, setLevel] = useState(0);
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const assetService = new AssetService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const [isloading, setIsloading] = useState(true);
  const router = useRouter();
  const ROUTES = useRoutes();

  useEffect(() => {
    const queryString = window.location.search;
    const par = new URLSearchParams(queryString);
    const parentId = par.get("parentId");
    const levelGetted =
      par.get("level") != null ? parseInt(par.get("level")!) : 1;
    if (id != "0") {
      setLoading(true);
      assetService
        .getAssetById(id as string)
        .then((asset: Asset) => {
          setValue("id", asset.id);
          setValue("active", asset.active);
          setValue("creationDate", asset.creationDate);
          setValue("name", asset.name);
          setValue("level", asset.level);
          setValue("parentId", asset.parentId);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
          setLoading(false);
        });
    } else {
      if (parentId != null || parentId != undefined) {
        setValue("parentId", parentId.length > 0 ? parentId : "");
      }
      setLevel(levelGetted);
      setValue("level", levelGetted!.toString().length > 0 ? levelGetted : 1);
    }
    setIsloading(false);
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (id != "0") {
        const newData: UpdateAssetRequest = {
          ...data,
          id: id as string,
          active: data.active,
          creationDate: data.creationDate,
        };
        await assetService.updateAsset(id as string, newData);
      } else {
        await assetService.createAsset(data);
      }

      setTimeout(() => {
        history.back();
      }, 2000);
      setLoading(false);
      // Redirect to assets list after successful action
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container>
        <div className="mx-auto max-w-md p-6 bg-white shadow-md rounded-md">
          {isloading ? (
            <SvgSpinner />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">
                {id !== "0"
                  ? "Actualizar Equip"
                  : `Afegir Equip - Nivell: ${level}`}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nom:</label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                  >
                    {loading ? (
                      <SvgSpinner />
                    ) : id !== "0" ? (
                      "Actualizar"
                    ) : (
                      "Afegir"
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                    onClick={(e) => {
                      router.push(ROUTES.assets);
                    }}
                  >
                    {loading ? <SvgSpinner /> : "Cancelar"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
