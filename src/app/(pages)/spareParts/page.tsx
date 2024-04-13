"use client";

import MainLayout from "components/layout/MainLayout";
import SparePart from "app/interfaces/SparePart";
import Link from "next/link";
import { useEffect, useState } from "react";
import SparePartService from "app/services/sparePartService";
import Container from "components/layout/Container";
import { useSessionStore } from "app/stores/globalStore";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interfaceTable";
import DataTable from "components/table/DataTable";
import { EntityTable } from "components/table/tableEntitys";

function SparePartsPage() {
  const sparePartService = new SparePartService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

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

  const tableButtons: TableButtons = {
    edit: true,
    delete: true,
  };

  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  const [loading, setLoading] = useState(true);
  const { loginUser } = useSessionStore((state) => state);

  useEffect(() => {
    async function fetchOperators() {
      try {
        const data = await sparePartService.getSpareParts();
        setSpareParts(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOperators();
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

  return (
    <MainLayout>
      <Container>
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
            <DataTable
              data={spareParts}
              columns={columns}
              filters={filters}
              tableButtons={tableButtons}
              entity={EntityTable.SPAREPART}
              onDelete={handleSparePartActiveChange}
            />
          </>
        )}
      </Container>
    </MainLayout>
  );
}

export default SparePartsPage;
