"use client";

import { useEffect, useState } from "react";
import Container from "components/layout/Container";
import MainLayout from "components/layout/MainLayout";
import SectionService from "app/services/sectionService";
import Section from "app/interfaces/Section";
import Link from "next/link";
import { SvgSpinner } from "app/icons/icons";
import DataTable from "components/table/DataTable";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interfaceTable";

export default function AuthenticationPage() {
  const sectionService = new SectionService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [sections, setSections] = useState<Section[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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
  ];

  const tableButtons: TableButtons = {
    edit: true,
    delete: true,
  };

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
  ];

  useEffect(() => {
    sectionService
      .getSections()
      .then((sections) => {
        setSections(sections);
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []);

  return (
    <MainLayout>
      <Container>
        <div className="flex justify-between">
          <Link
            href={{
              pathname: "/section/id",
            }}
            className="text-white mb-2 rounded-md bg-blue-500 px-4 py-2 flex"
            onClick={(e) => setIsLoading(true)}
          >
            Crear Secció
            {isLoading && <SvgSpinner style={{ marginLeft: "0.5rem" }} />}
          </Link>
        </div>
        <DataTable
          data={sections}
          tableButtons={tableButtons}
          filters={filters}
          columns={columns}
          entity="SECTIONS"
        />
      </Container>
    </MainLayout>
  );
}
