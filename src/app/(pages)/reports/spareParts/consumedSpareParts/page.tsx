import MainLayout from "components/layout/MainLayout";
import ConsumedSparePartsComponent from "./consumedSparePartsComponent";
import Container from "components/layout/Container";

export default function consumedSparePartReport() {
  return (
    <MainLayout>
      <Container>
        <ConsumedSparePartsComponent />
      </Container>
    </MainLayout>
  );
}
