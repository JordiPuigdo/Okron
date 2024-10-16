"use client";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import SparePartTable from "./components/SparePartTable";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";

function SparePartsPage() {
  const { loginUser } = useSessionStore((state) => state);
  const validPermission = [
    UserPermission.Administrator,
    UserPermission.SpareParts,
  ];
  const canEdit = validPermission.includes(loginUser?.permission!);
  return (
    <MainLayout>
      <Container>
        <div className="p-2">
          <p>Menu {">"} Recanvis</p>
        </div>
        <div className="mt-2">
          <SparePartTable
            enableFilters={true}
            enableEdit={canEdit}
            enableDelete={canEdit}
          />
        </div>
      </Container>
    </MainLayout>
  );
}

export default SparePartsPage;
