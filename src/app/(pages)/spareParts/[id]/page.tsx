"use client";

import MainLayout from "components/layout/MainLayout";
import SparePart, {
  SparePartDetailRequest,
  SparePartDetailResponse,
  SparePartPerAssetResponse,
} from "app/interfaces/SparePart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SparePartService from "app/services/sparePartService";
import Container from "components/layout/Container";
import { formatDate, startOrEndDate, formatDateQuery } from "app/utils/utils";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import Link from "next/link";
import TableSparePartsConsumed from "../components/tableSparePartsConsumed";
import SimpleDataTable from "components/table/simpleDataTable/SimpleDataTable";
import SparePartTable from "../components/SparePartTable";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { SvgSpinner } from "app/icons/icons";
import {
  CreateDocumentationRequest,
  DeleteDocumentationRequest,
  ObjectToInsert,
} from "app/interfaces/Documentation";
import { useSessionStore } from "app/stores/globalStore";
import DocumentationService from "app/services/documentationService";

export default function EditSparePart({ params }: { params: { id: string } }) {
  const router = useRouter();
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const documentationService = new DocumentationService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
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
  const [sparePerMachine, setSparePartPerMachine] = useState<
    SparePartPerAssetResponse[] | null
  >([]);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 15);

  const [startDate, setStartDate] = useState<Date | null>(currentDate);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const { loginUser } = useSessionStore((state) => state);
  const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchSparePart = async () => {
      try {
        const x: SparePartDetailRequest = {
          id: params.id,
          startDate: formatDateQuery(startDate!, true),
          endDate: formatDateQuery(endDate!, false),
        };
        const sparePartDetailResponse = await sparePartService.getSparePart(x);

        /*Object.entries(sparePart).forEach(([key, value]) => {
          const typedKey = key as keyof SparePart;
          setValue(typedKey, value[typedKey]);
        });*/
        setValue("id", sparePartDetailResponse.sparePart.id);
        setValue("code", sparePartDetailResponse.sparePart.code);
        setValue("description", sparePartDetailResponse.sparePart.description);
        setValue(
          "ubication",
          sparePartDetailResponse.sparePart.ubication != null
            ? sparePartDetailResponse.sparePart.ubication
            : ""
        );
        setValue("refProvider", sparePartDetailResponse.sparePart.refProvider);
        setValue("family", sparePartDetailResponse.sparePart.family);
        setValue(
          "brand",
          sparePartDetailResponse.sparePart.brand != null
            ? sparePartDetailResponse.sparePart.brand
            : ""
        );
        setValue("stock", sparePartDetailResponse.sparePart.stock);
        setValue("price", sparePartDetailResponse.sparePart.price);
        setValue("active", sparePartDetailResponse.sparePart.active);
        setSparePartPerMachine(
          sparePartDetailResponse.sparePartPerMachineResponse
        );
        setSparePart(sparePartDetailResponse.sparePart);
      } catch (error) {
        setShowErrorMessage(true);
      }
    };

    fetchSparePart();
  }, [params.id, setValue]);

  const toggleLoading = (key: string) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [key]: !prevLoadingMap[key],
    }));
  };

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
    toggleLoading("CANCEL");
    router.back();
  }

  function handleDocumentationAdd() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      toggleLoading("DOCUMENTATION");
      const request: CreateDocumentationRequest = {
        userId: "65d8cae3567750628478d06b",
        fileName: file.name,
        file: file,
        objectId: sparePart!.id,
        object: ObjectToInsert.SparePart,
      };

      documentationService
        .createDocumentation(request)
        .then((response) => {
          if (response) {
            sparePartService.cleanCache();
            toggleLoading("DOCUMENTATION");
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
          setShowErrorMessage(true);
          toggleLoading("DOCUMENTATION");
        });
    }
  }

  function handleDeleteDocumentation(id: string, fileName: string) {
    toggleLoading("DELETEDOCUMENTATION");
    const request: DeleteDocumentationRequest = {
      userId: "65d8cae3567750628478d06b",
      objectId: sparePart!.id,
      object: ObjectToInsert.SparePart,
      fileId: id,
      fileName: fileName,
    };

    documentationService.deleteDocumentation(request).then((response) => {
      if (response) {
        console.log(response);
        sparePartService.cleanCache();
        toggleLoading("DOCUMENTATION");
        window.location.reload();
      }
    });
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
          <div className="gap-4 p-4 bg-white shadow-md rounded-md">
            {renderHeader()}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row gap-4 items-start w-full">
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

                <div className="flex-grow mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Descripció
                  </label>
                  <input
                    {...register("description")}
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start w-full">
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

                <div className="flex-grow mb-4">
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
                    Preu
                  </label>
                  <input
                    {...register("price")}
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Actiu
                  </label>
                  <input
                    {...register("active")}
                    type="checkbox"
                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex bg-okron-btCreate text-white px-4 py-2 rounded-md hover:bg-okron-btCreateHover focus:outline-none focus:ring focus:border-blue-300"
                  onClick={(e) => toggleLoading("SAVE")}
                >
                  Guardar
                  {loadingMap["SAVE"] && <SvgSpinner className="2-6 h-6" />}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="flex bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:border-gray-300"
                >
                  Cancelar
                  {loadingMap["CANCEL"] && <SvgSpinner className="2-6 h-6" />}
                </button>
              </div>
              <div className="py-4">
                {showSuccessMessage && (
                  <p className="bg-green-200 text-green-800 p-4 rounded mb-4">
                    Recanvi actualitzat correctament
                  </p>
                )}
                {showErrorMessage && (
                  <p className="bg-red-200 text-red-800 p-4 rounded mb-4">
                    Error actualitzant el recanvi
                  </p>
                )}
              </div>
            </form>
            <span className="text-xl font-bold">Documentació</span>
            <div className="pt-4">
              {sparePart?.documentation?.map((document) => (
                <div
                  key={document.id}
                  className="flex py-2 gap-4 items-center border-2 p-2"
                >
                  <a href={document.url} target="_blank">
                    <span className="block text-sm text-blue-500 hover:text-blue-800 underline">
                      {document.fileName}
                    </span>
                  </a>
                  <button
                    type="button"
                    className="flex bg-okron-btDelete text-white px-4 py-2 rounded-md hover:bg-okron-btDeleteHover focus:outline-none focus:ring focus:border-gray-300"
                    onClick={() =>
                      handleDeleteDocumentation(
                        document.id!,
                        document.fileName!
                      )
                    }
                  >
                    Eliminar
                    {loadingMap["DELETEDOCUMENTATION"] && (
                      <SvgSpinner className="2-6 h-6" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <input
                type="file"
                id="fileInput"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="flex bg-okron-btCreate text-white px-4 py-2 rounded-md hover:bg-okron-btCreateHover focus:outline-none focus:ring focus:border-blue-300"
                onClick={handleDocumentationAdd}
              >
                Afegir Documentació
                {loadingMap["DOCUMENTATION"] && (
                  <SvgSpinner className="2-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="py-4">
            <TabGroup>
              <TabList className="mt-4">
                <Tab>Històric de consums</Tab>
                <Tab>Històric de comandes</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SparePartTable
                    sparePartId={params.id}
                    enableFilters={false}
                    enableDetail={true}
                    enableCreate={false}
                  />
                </TabPanel>
                <TabPanel></TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </Container>
      </MainLayout>
    );
}
