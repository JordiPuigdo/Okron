"use client";

import { useState, useEffect } from "react";
import AssetService from "app/services/assetService";
import {
  Asset,
  CreateAssetRequest,
  UpdateAssetRequest,
} from "app/interfaces/Asset";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import AssetForm from "../components/assetForm";
import { SvgSpinner } from "app/icons/icons";
import PreventiveService from "app/services/preventiveService";
import PreventiveTable from "app/(pages)/preventive/preventiveTable/preventiveTable";
import WorkOrderTable from "app/(pages)/workOrders/components/WorkOrderTable";
import {
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import SparePartTable from "app/(pages)/spareParts/components/SparePartTable";

export default function AssetDetailsPage({
  params,
}: {
  params: { id: string; parentId: string };
}) {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const assetService = new AssetService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const [isloading, setIsloading] = useState(true);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [levelGetted, setLevelGetted] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (id !== "0") {
      setLoading(true);
      assetService
        .getAssetById(id as string)
        .then((asset: Asset) => {
          setCurrentAsset(asset);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
          setLoading(false);
        });
    }
    setIsloading(false);
  }, [id]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const parentId = urlParams.get("parentId");
    const level = urlParams.get("level");

    setParentId(parentId);
    setLevelGetted(level?.toString() ? parseInt(level) : 1);
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      if (id !== "0") {
        const newData: UpdateAssetRequest = {
          code: data.code,
          description: data.description,
          id: id,
          active: data.active,
          level: data.level,
          parentId: data.parentId,
          createWorkOrder: data.createWorkOrder,
        };
        await assetService.updateAsset(id, newData).then((data) => {
          if (data) {
            setMessage("Actualitzat correctament");
            setTimeout(() => {
              history.back();
            }, 2000);
          } else {
            setErrorMessage("Error actualitzant l'equip");
          }
        });
      } else {
        const newData: CreateAssetRequest = {
          code: data.code,
          description: data.description,
          level: levelGetted!,
          parentId: parentId!,
          createWorkOrder: data.createWorkOrder,
        };
        await assetService
          .createAsset(newData)
          .then((data) => {
            if (data) {
              setMessage("Creat correctament");
              setTimeout(() => {
                history.back();
              }, 2000);
            } else {
              setErrorMessage("Error creant l'equip");
            }
          })
          .catch((x) => {
            setErrorMessage("Error : " + x.message);
          });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container>
        {isloading ? (
          <SvgSpinner className="items-center justify-center" />
        ) : (
          <>
            <div className="p-4 bg-white shadow-md rounded-md w-full">
              <AssetForm
                id={id}
                loading={loading}
                assetData={currentAsset != null ? currentAsset : undefined}
                level={levelGetted!}
                parentId={parentId != null ? parentId : ""}
                onSubmit={onSubmit}
              />
              {message && (
                <div className="bg-green-200 text-green-800 p-4 rounded my-4">
                  {message}
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-200 text-red-800 p-4 rounded my-4">
                  {errorMessage}
                </div>
              )}
            </div>
            {id != "0" && (
              <div className="flex flex-col gap-4">
                <div>
                  <TabGroup className="bord">
                    <TabList className="mt-4">
                      <Tab className="font-semibold">Ordres de treball</Tab>
                      <Tab className="font-semibold">Revisions</Tab>
                      <Tab className="font-semibold">Recanvis</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <WorkOrderTable
                          enableFilters={true}
                          enableEdit={false}
                          enableDelete={false}
                          enableDetail={true}
                          assetId={id}
                        />
                      </TabPanel>
                      <TabPanel>
                        <PreventiveTable
                          enableFilters={true}
                          enableDelete={false}
                          enableEdit={false}
                          assetId={id}
                        />
                      </TabPanel>
                      <TabPanel>
                        <SparePartTable
                          enableFilters={true}
                          enableEdit={false}
                          enableDelete={false}
                          enableDetail={true}
                          enableCreate={false}
                          assetId={id}
                        />
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </MainLayout>
  );
}
