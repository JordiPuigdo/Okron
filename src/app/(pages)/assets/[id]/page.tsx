"use client";
import { useState, useEffect } from "react";
import AssetService from "app/services/assetService";
import { Asset, UpdateAssetRequest } from "app/interfaces/Asset";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import { useRouter } from "next/navigation";
import useRoutes from "app/utils/useRoutes";
import AssetForm from "../components/assetForm";
import { SvgSpinner } from "app/icons/icons";
import TableSparePartsConsumed from "app/(pages)/spareParts/components/tableSparePartsConsumed";
import TableWorkOrdersPerAsset from "app/(pages)/workOrders/components/tableWorkOrdersPerAsset";

export default function AssetDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const assetService = new AssetService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const [isloading, setIsloading] = useState(true);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null); // Track current asset data
  const [level, setLevel] = useState(0);
  const queryString = window.location.search;
  const par = new URLSearchParams(queryString);
  const parentId = par.get("parentId");
  const levelGetted =
    par.get("level") != null ? parseInt(par.get("level")!) : 1;

  useEffect(() => {
    if (id !== "0") {
      setLoading(true);
      assetService
        .getAssetById(id as string)
        .then((asset: Asset) => {
          setCurrentAsset(asset); // Set current asset data
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
          setLoading(false);
        });
    }
    setIsloading(false);
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (id !== "0") {
        const newData: UpdateAssetRequest = {
          ...data,
          id: id,
          active: data.active,
          creationDate: data.creationDate,
        };
        await assetService.updateAsset(id, newData);
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
        {isloading ? (
          <SvgSpinner />
        ) : (
          <>
            <div className="mx-auto max-w-md p-6 bg-white shadow-md rounded-md">
              <AssetForm
                id={id}
                loading={loading}
                assetData={currentAsset != null ? currentAsset : undefined}
                level={levelGetted}
                parentId={parentId != null ? parentId : ""}
                onSubmit={onSubmit}
              />
            </div>
            {
              <div>
                <TableSparePartsConsumed
                  assetId={id}
                  searchPlaceHolder="Buscar per operari"
                />
                <TableWorkOrdersPerAsset assetId={id} />
              </div>
            }
          </>
        )}
      </Container>
    </MainLayout>
  );
}
