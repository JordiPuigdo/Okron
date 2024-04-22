"use client";
import { SvgSpinner } from "app/icons/icons";
import SparePart, {
  SparePartDetailRequest,
  SparePartPerAssetResponse,
} from "app/interfaces/SparePart";
import SparePartService from "app/services/sparePartService";
import { useSessionStore } from "app/stores/globalStore";
import DataTable from "components/table/DataTable";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interfaceTable";
import { EntityTable } from "components/table/tableEntitys";
import Link from "next/link";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import { formatDateQuery } from "app/utils/utils";

interface SparePartTableProps {
  enableFilterAssets?: boolean;
  enableFilters: boolean;
  enableDetail?: boolean;
  enableEdit: boolean;
  enableDelete: boolean;
  assetId?: string | "";
  enableCreate?: boolean;
}

const columns: Column[] = [
  {
    label: "ID",
    key: "id",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Codi",
    key: "code",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Descripció",
    key: "description",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Família",
    key: "family",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Ref. Proveïdor",
    key: "refProvider",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Ubicació",
    key: "ubication",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Stock",
    key: "stock",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Actiu",
    key: "active",
    format: ColumnFormat.BOOLEAN,
  },
];

const columnsPerAsset: Column[] = [
  {
    label: "ID",
    key: "id",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Codi",
    key: "workOrderCode",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Descripció OT",
    key: "workOrderDescription",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Operari",
    key: "operatorName",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Codi Recanvi",
    key: "sparePartCode",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Descripció Recanvi",
    key: "sparePartDescription",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Quantitat",
    key: "sparePartQuantity",
    format: ColumnFormat.NUMBER,
  },
];

const filters: Filters[] = [
  {
    key: "code",
    label: "Codi",
    format: FiltersFormat.TEXT,
  },
  {
    key: "description",
    label: "Descripció",
    format: FiltersFormat.TEXT,
  },
  {
    key: "family",
    label: "Família",
    format: FiltersFormat.TEXT,
  },
  {
    key: "refProvider",
    label: "Referència Proveïdor",
    format: FiltersFormat.TEXT,
  },
  {
    key: "ubication",
    label: "Ubicació",
    format: FiltersFormat.TEXT,
  },
];

const SparePartTable: React.FC<SparePartTableProps> = ({
  enableFilterAssets = false,
  enableFilters = false,
  enableDetail = false,
  enableEdit,
  enableDelete,
  assetId,
  enableCreate = true,
}) => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [sparePartsPerAsset, setSparePartsPerAsset] = useState<
    SparePartPerAssetResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL!
  );
  const { loginUser } = useSessionStore((state) => state);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  const tableButtons: TableButtons = {
    edit: enableEdit,
    delete: enableDelete,
    detail: enableDetail,
  };

  useEffect(() => {
    async function fetchSpareParts() {
      try {
        const data = await sparePartService.getSpareParts();
        setSpareParts(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      } finally {
        setLoading(false);
      }
    }

    if (assetId == undefined) fetchSpareParts();
  }, []);

  const handleSparePartActiveChange = async (id: string) => {
    const isConfirmed = window.confirm(
      "Segur que voleu eliminar aquest recanvi?"
    );
    if (isConfirmed) {
      await sparePartService.deleteSparePart(id).then((data) => {
        window.location.reload();
      });
    }
  };

  async function filterSpareParts() {
    const x: SparePartDetailRequest = {
      assetId: assetId,
      startDate: formatDateQuery(startDate!, true),
      endDate: formatDateQuery(endDate!, false),
    };

    await sparePartService
      .getSparePartHistoryByDates(x)
      .then((response) => {
        if (response.length == 0) {
          setErrorMessage("No hi ha recanvis disponibles amb aquests filtres");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
          return;
        }
        setSparePartsPerAsset(response);
      })
      .catch((error) => {
        setErrorMessage(error);
        setTimeout(() => {
          setErrorMessage("");
        });
      });
  }
  function handleSearch(): void {
    filterSpareParts();
  }

  const renderFilter = () => {
    return (
      <div className="bg-white p-2 my-4 rounded-xl gap-4">
        <div className="flex gap-4 my-4 items-center">
          <div className="flex items-center">
            <label htmlFor="startDate" className="mr-2">
              Inici:
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              locale={ca}
              className="border border-gray-300 p-2 rounded-md mr-4"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="endDate" className="mr-2">
              Final
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              locale={ca}
              className="border border-gray-300 p-2 rounded-md mr-4"
            />
          </div>
          <button
            type="button"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
            onClick={(e) => handleSearch()}
          >
            Buscar
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </button>
          {message != "" && (
            <span className="text-red-500 ml-4">{message}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {enableCreate && (
        <>
          <h1 className="text-2xl font-bold mb-4">Recanvis</h1>

          {loading ? (
            <p>Carregant dades...</p>
          ) : (
            <>
              {loginUser != undefined && loginUser?.permission > 0 && (
                <div className="mb-4">
                  {" "}
                  <Link
                    href="/spareParts/sparePartForm"
                    as={`/spareParts/sparePartForm`}
                    className="bg-blue-500 text-white px-3 py-1 ml-2 rounded-md "
                  >
                    Crear
                  </Link>
                </div>
              )}
            </>
          )}
        </>
      )}
      {assetId != undefined ? (
        <>
          {renderFilter()}
          <DataTable
            columns={columnsPerAsset}
            data={sparePartsPerAsset}
            tableButtons={tableButtons}
            entity={EntityTable.WORKORDER}
            filters={enableFilters ? filters : undefined}
            onDelete={handleSparePartActiveChange}
            enableFilterActive={false}
            totalCounts={true}
          />
        </>
      ) : (
        <DataTable
          columns={columns}
          data={spareParts}
          tableButtons={tableButtons}
          entity={EntityTable.WORKORDER}
          filters={enableFilters ? filters : undefined}
          onDelete={handleSparePartActiveChange}
          enableFilterActive={true}
        />
      )}
    </>
  );
};

export default SparePartTable;
