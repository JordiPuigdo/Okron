"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreatePreventiveRequest, Preventive } from "app/interfaces/Preventive";
import { useRouter } from "next/navigation";
import PreventiveService from "app/services/preventiveService";
import SparePartService from "app/services/sparePartService";
import InspectionPointService from "app/services/inspectionPointService";
import SparePart from "app/interfaces/SparePart";
import InspectionPoint from "app/interfaces/inspectionPoint";
import OperatorService from "app/services/operatorService";
import Operator from "app/interfaces/Operator";
import MachineService from "app/services/machineService";
import Machine from "app/interfaces/machine";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import { SvgSpinner } from "app/icons/icons";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import ChooseInspectionPoint from "components/inspectionPoint/ChooseInspectionPoint";
import ChooseOperatorV2 from "components/operator/ChooseOperatorV2";
import ChooseElement from "components/ChooseElement";
import machine from "app/interfaces/machine";
import AssetService from "app/services/assetService";
import { ElementList } from "components/selector/ElementList";
import { Asset } from "app/interfaces/Asset";

const PreventiveForm = () => {
  const router = useRouter();
  const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [selectedSpareParts, setSelectedSpareParts] = useState<string[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  const [availableSpareParts, setAvailableSpareParts] = useState<SparePart[]>(
    []
  );
  const [availableInspectionPoints, setAvailableInspectionPoints] = useState<
    InspectionPoint[]
  >([]);
  const [aviableMachines, setAviableMachines] = useState<Machine[]>([]);
  const [selectedInspectionPoints, setSelectedInspectionPoints] = useState<
    string[]
  >([]);
  const assetService = new AssetService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const preventiveService = new PreventiveService(apiURL);
  const sparePartService = new SparePartService(apiURL);
  const inspectionPointService = new InspectionPointService(apiURL);
  const operatorService = new OperatorService(apiURL);
  const machineService = new MachineService(apiURL);
  const { register, handleSubmit, setValue } = useForm<Preventive>();
  const [filterText, setFilterText] = useState<string>("");
  const filteredInspectionPoints = availableInspectionPoints.filter((point) =>
    point.description.toLowerCase().includes(filterText.toLowerCase())
  );
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [date, setDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [preventiveDays, setPreventiveDays] = useState(0);
  const [assets, setAssets] = useState<ElementList[]>([]);
  const [selectedAssets, setSelectedAsset] = useState<string[]>([]);

  useEffect(() => {
    const fetchInspectionPoints = async () => {
      try {
        const points = await inspectionPointService.getAllInspectionPoints();
        setAvailableInspectionPoints(points.filter((x) => x.active == true));
      } catch (error) {
        console.error("Error fetching inspection points:", error);
      }
    };

    const fetchOperators = async () => {
      await operatorService.getOperators().then((workOperator) => {
        setOperators(workOperator);
      });
    };

    const fetchAssets = async () => {
      try {
        const assets = await assetService.getAll();
        const elements: ElementList[] = [];

        const addAssetAndChildren = (asset: Asset) => {
          if (asset.createWorkOrder) {
            elements.push({
              id: asset.id,
              description: asset.description,
            });
          }
          asset.childs.forEach((childAsset) => {
            addAssetAndChildren(childAsset);
          });
        };

        assets.forEach((asset) => {
          addAssetAndChildren(asset);
        });

        setAssets(elements);
      } catch (error) {
        console.error("Error al obtener activos:", error);
      }
    };

    fetchInspectionPoints();
    fetchOperators();
    fetchAssets();
    let counter = 1;
    const params = new URLSearchParams(window.location.search);
    const numberPreventive = params.get("counter");
    if (numberPreventive || 0 > 0) {
      counter = 1;
    }
  }, []);

  const handleDeleteInspectionPointSelected = (inspectionPointId: string) => {
    setSelectedInspectionPoints((prevSelected) =>
      prevSelected.filter((id) => id !== inspectionPointId)
    );
  };

  const handleInspectionPointSelected = (inspectionPointId: string) => {
    if (inspectionPointId == "") return;
    setSelectedInspectionPoints((prevSelected) => [
      ...prevSelected,
      inspectionPointId,
    ]);
  };

  function convertToCreateWorkOrderRequest(
    preventive: Preventive
  ): CreatePreventiveRequest {
    const createPreventiveRequest: CreatePreventiveRequest = {
      code: preventive.code,
      description: preventive.description,
      startExecution: startDate!,
      days: preventiveDays,
      counter: 0,
      assetId: selectedAssets.map((asset) => asset),
      inspectionPointId: selectedInspectionPoints.map((point) => point),
      operatorId: selectedOperator.map((operator) => operator),
    };
    return createPreventiveRequest;
  }

  const onSubmit: SubmitHandler<Preventive> = async (data) => {
    setIsLoading(true);
    try {
      if (!notValidForm(data)) {
        setIsLoading(false);
        return;
      }
      const response = await preventiveService.createPreventive(
        convertToCreateWorkOrderRequest(data)
      );

      if (response) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          history.back();
        }, 2000);
      } else {
        setTimeout(() => {
          setShowErrorMessage(false);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 2000);
    }
  };

  function notValidForm(preventive: Preventive) {
    let invalidFields = [];

    if (!preventive.code || preventive.code.trim().length === 0) {
      invalidFields.push("Code");
    }

    if (!preventive.description || preventive.description.trim().length === 0) {
      invalidFields.push("Description");
    }

    if (!startDate) {
      invalidFields.push("StartDate");
    }

    if (preventiveDays === 0) {
      invalidFields.push("PreventiveDays");
    }

    if (selectedInspectionPoints.length === 0) {
      invalidFields.push("SelectedInspectionPoints");
    }

    if (selectedOperator.length === 0) {
      invalidFields.push("SelectedOperator");
    }

    if (selectedAssets.length === 0) {
      invalidFields.push("SelectedAssets");
    }

    if (invalidFields.length > 0) {
      console.log("Invalid fields:", invalidFields);
      alert("Falten dades per assignar al preventiu");
      return false;
    }

    return true;
  }

  const handleDeleteSelectedOperator = (operatorId: string) => {
    setSelectedOperator((prevSelected) =>
      prevSelected.filter((id) => id !== operatorId)
    );
  };

  const handleSelectedOperator = (operatorId: string) => {
    if (operatorId == "") return;
    setSelectedOperator((prevSelected) => [...prevSelected, operatorId]);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleAssetSelected = (assetId: string) => {
    if (assetId == "") return;
    setSelectedAsset((prevSelected) => [...prevSelected, assetId]);
  };

  const handleDeleteSelectedAsset = (assetId: string) => {
    setSelectedAsset((prevSelected) =>
      prevSelected.filter((id) => id !== assetId)
    );
  };

  return (
    <MainLayout>
      <Container>
        <div className="w-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto bg-white p-8 rounded shadow-md"
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <p className="text-2xl font-bold text-black">Nova revisió</p>

            <div className="grid grid-cols-4 w-full gap-4 py-4">
              <div className="col-span-2">
                <label
                  className="text-gray-700 font-bold text-lg"
                  htmlFor="code"
                >
                  Codi
                </label>
                <input
                  {...register("code")}
                  id="code"
                  type="text"
                  className="form-input border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="col-span-2">
                <label
                  className="text-gray-700 font-bold mb-2 text-lg"
                  htmlFor="description"
                >
                  Descripció
                </label>
                <input
                  {...register("description")}
                  id="description"
                  type="text"
                  className="form-input border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 w-full gap-4 py-4">
              <div className="col-span-2">
                <label
                  className="block text-gray-700 font-bold mb-2 text-lg"
                  htmlFor="days"
                >
                  Freqüència Dies
                </label>
                <input
                  value={preventiveDays}
                  onChange={(e) => setPreventiveDays(parseInt(e.target.value))}
                  id="days"
                  type="number"
                  className="form-input border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="col-span-2">
                <label
                  className="block text-gray-700 font-bold mb-2 text-lg"
                  htmlFor="startExecution"
                >
                  Primera Execució
                </label>
                <DatePicker
                  id="startDate"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={ca}
                  className="border border-gray-300 p-2 rounded-md mr-4 w-full"
                />
              </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="flex flex-row gap-4 py-4 w-full">
              <ChooseInspectionPoint
                preventiveInspectionPoints={availableInspectionPoints}
                onInspectionPointSelected={handleInspectionPointSelected}
                onDeleteInspectionPointSelected={
                  handleDeleteInspectionPointSelected
                }
                preventiveSelectedInspectionPoints={selectedInspectionPoints}
              />
              <ChooseOperatorV2
                availableOperators={operators}
                preventiveSelectedOperators={selectedOperator}
                onDeleteSelectedOperator={handleDeleteSelectedOperator}
                onSelectedOperator={handleSelectedOperator}
              />
              <ChooseElement
                elements={assets}
                selectedElements={selectedAssets}
                onElementSelected={handleAssetSelected}
                onDeleteElementSelected={handleDeleteSelectedAsset}
                placeholder="Buscar Equip"
                mapElement={(asset) => ({
                  id: asset.id,
                  description: asset.description,
                })}
                labelText="Equips"
              />
            </div>

            <div className="flex flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`${
                  showSuccessMessage
                    ? "bg-green-500"
                    : showErrorMessage
                    ? "bg-red-500"
                    : "bg-blue-500"
                } hover:${
                  showSuccessMessage
                    ? "bg-green-700"
                    : showErrorMessage
                    ? "bg-red-700"
                    : "bg-blue-700"
                } text-white font-bold py-2 px-4 rounded mt-6 flex items-center justify-center`}
              >
                Crear Revisió
                {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-6"
              >
                Cancelar
              </button>
            </div>
            <div className="flex flex-row py-4 w-full">
              {showSuccessMessage && (
                <div className="bg-green-200 text-green-800 p-4 rounded mb-4 w-1/4">
                  Revisió creada correctament
                </div>
              )}

              {showErrorMessage && (
                <div className="  bg-red-200 text-red-800 p-4 rounded mb-4 w-1/4">
                  Error al crear revisió
                </div>
              )}
            </div>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
};

export default PreventiveForm;
