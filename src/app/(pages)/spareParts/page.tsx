"use client";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import SparePartTable from "./components/SparePartTable";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";

function SparePartsPage() {
  const { loginUser } = useSessionStore((state) => state);
  return (
    <MainLayout>
      <Container>
        <SparePartTable
          enableFilters={true}
          enableEdit={loginUser?.permission == UserPermission.Administrator}
          enableDelete={loginUser?.permission == UserPermission.Administrator}
        />
      </Container>
    </MainLayout>
  );
}

export default SparePartsPage;
