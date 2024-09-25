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
import PreventiveTable from "app/(pages)/preventive/preventiveTable/preventiveTable";
import WorkOrderTable from "app/(pages)/workOrders/components/WorkOrderTable";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import SparePartTable from "app/(pages)/spareParts/components/SparePartTable";
import DatePicker from "react-datepicker";
import ca from "date-fns/locale/ca";
import WorkOrderService from "app/services/workOrderService";
import { CostsObject } from "components/Costs/CostsObject";

interface AssetCosts {
  totalCosts: number;
  operatorCosts: number;
  sparePartCosts: number;
}

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
  const workOrderService = new WorkOrderService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [assetCosts, setAssetCosts] = useState<AssetCosts>({
    totalCosts: 0,
    operatorCosts: 0,
    sparePartCosts: 0,
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

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

  async function caculateAssetCosts() {
    const workOrders = await getWorkOrders();
    let totalCosts: AssetCosts = {
      totalCosts: 0,
      operatorCosts: 0,
      sparePartCosts: 0,
    };
    workOrders?.forEach((workOrder) => {
      const operatorCosts = workOrder.workOrderOperatorTimes?.reduce(
        (acc, x) => acc + x.operator.priceHour,
        0
      );
      const sparePartCosts = workOrder.workOrderSpareParts?.reduce(
        (acc, x) => acc + x.sparePart.price,
        0
      );
      totalCosts.operatorCosts += operatorCosts || 0;
      totalCosts.sparePartCosts += sparePartCosts || 0;
      totalCosts.totalCosts += (operatorCosts || 0) + (sparePartCosts || 0);
    });

    setAssetCosts(totalCosts);
  }

  async function getWorkOrders() {
    try {
      const workOrders = await workOrderService.getWorkOrdersWithFilters({
        assetId: id,
        startDateTime: startDate!,
        endDateTime: endDate!,
      });
      return workOrders;
    } catch (error) {
      console.error("Error fetching work orders:", error);
    }
  }

  return (
    <MainLayout>
      <Container>
        {isloading ? (
          <SvgSpinner className="items-center justify-center" />
        ) : (
          <>
            <div className="p-4 bg-white shadow-md rounded-md w-full">
              <div className="flex flex-row justify-start gap-12">
                <AssetForm
                  id={id}
                  loading={loading}
                  assetData={currentAsset != null ? currentAsset : undefined}
                  level={levelGetted!}
                  parentId={parentId != null ? parentId : ""}
                  onSubmit={onSubmit}
                />
                <div className="flex flex-col gap-5">
                  <div className="flex flex-row items-center gap-4">
                    <span className="font-semibold">Costos entre dates</span>
                    <DatePicker
                      id="startDate"
                      selected={startDate}
                      onChange={(date: Date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ca}
                      className="p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <DatePicker
                      id="endDate"
                      selected={endDate}
                      onChange={(date: Date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      locale={ca}
                      className="p-3 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                      onClick={caculateAssetCosts}
                    >
                      Calcular
                    </button>
                  </div>
                  <CostsObject {...assetCosts} />
                </div>
              </div>
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
                          enableEdit={true}
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
