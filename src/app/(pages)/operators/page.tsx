"use client";

import React, { useEffect, useState } from "react";
import OperatorForm from "../../../components/OperatorForm";
import OperatorService from "app/services/operatorService";
import Operator, { OperatorType } from "app/interfaces/Operator";
import Link from "next/link";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import DataTable from "components/table/DataTable";
import {
  Column,
  ColumnFormat,
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interface/interfaceTable";
import { EntityTable } from "components/table/interface/tableEntitys";
import { Button } from "designSystem/Button/Buttons";

function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);

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
      label: "Nom",
      key: "name",
      format: ColumnFormat.TEXT,
    },
    {
      label: "Tipus",
      key: "operatorType",
      format: ColumnFormat.OPERATORTYPE,
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
      key: "name",
      label: "Nom",
      format: FiltersFormat.TEXT,
    },
  ];

  const tableButtons: TableButtons = {
    edit: true,
    delete: true,
  };

  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isOperatorCreated, setIsOperatorCreated] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    async function fetchOperators() {
      try {
        const data = await operatorService.getOperators();
        setOperators(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    }

    fetchOperators();
  }, [isOperatorCreated]);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  async function createOperator(operator: Operator) {
    const existingOperator = operators.find((op) => op.code === operator.code);

    if (existingOperator) {
      alert(`Operari amb codi ${operator.code} ja existeix.`);
    } else {
      if (operator.operatorType == null)
        operator.operatorType = OperatorType.Maintenance;
      const data = await operatorService.createOperator(operator);
      setIsOperatorCreated(true);
      setIsFormVisible(false);
    }
  }

  async function deleteOperator(id: string) {
    const isConfirmed = window.confirm(
      "Segur que voleu eliminar aquest operari?"
    );
    if (isConfirmed) {
      await operatorService.deleteOperator(id);
      setOperators((prevOperators) =>
        prevOperators.filter((prevOperators) => prevOperators.id !== id)
      );
    }
  }

  return (
    <MainLayout>
      <Container>
        <Button onClick={toggleFormVisibility} className="py-4">
          {isFormVisible ? "Tancar" : "Crear Operari"}
        </Button>

        {isFormVisible && (
          <OperatorForm
            onSubmit={createOperator}
            onCancel={function (): void {
              setIsFormVisible(false);
            }}
            onUpdatedSuccesfully={null}
          />
        )}
        <div className="overflow-x-auto text-black">
          <DataTable
            data={operators.sort((a, b) => a.code.localeCompare(b.code))}
            filters={filters}
            columns={columns}
            tableButtons={tableButtons}
            entity={EntityTable.OPERATOR}
            onDelete={deleteOperator}
          />
        </div>
      </Container>
    </MainLayout>
  );
}

export default OperatorsPage;
