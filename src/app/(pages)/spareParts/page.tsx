import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import SparePartTable from "./components/SparePartTable";

function SparePartsPage() {
  return (
    <MainLayout>
      <Container>
        <SparePartTable
          enableFilters={true}
          enableEdit={true}
          enableDelete={true}
        />
      </Container>
    </MainLayout>
  );
}

export default SparePartsPage;
