"use client";

import { useEffect, useState } from "react";
import { SvgSpinner } from "app/icons/icons";
import { User } from "app/interfaces/User";
import UserService from "app/services/userService";
import Container from "components/layout/Container";
import MainLayout from "components/layout/MainLayout";
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

const columns: Column[] = [
  {
    label: "ID",
    key: "id",
    format: ColumnFormat.TEXT,
  },
  {
    label: "Usuari",
    key: "username",
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
    key: "description",
    label: "Descripció",
    format: FiltersFormat.TEXT,
  },
];

const tableButtons: TableButtons = {
  edit: true,
  delete: true,
};
export default function UsersPage() {
  const userService = new UserService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const fetchUsers = async () => {
    await userService.getUsers().then((data) => {
      if (data) {
        setUsers(data);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <MainLayout>
      <Container>
        <>
          {isLoading ? (
            <p>Carregant dades...</p>
          ) : (
            <div className="flex flex-col gap-4">
              <Button
                type="create"
                onClick={() => setIsLoadingCreate(true)}
                customStyles="flex gap-2 w-[10%] justify-center"
              >
                Crear Usuari
                {isLoadingCreate && <SvgSpinner className="w-6 h-6" />}
              </Button>
              <DataTable
                data={users}
                columns={columns}
                tableButtons={tableButtons}
                entity={EntityTable.SECTION}
              />
            </div>
          )}
        </>
      </Container>
    </MainLayout>
  );
}
