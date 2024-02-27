import SparePartForm from "./sparePartForm";
import MainLayout from "components/layout/MainLayout";

function SparePartsFormPage() {
  return (
    <MainLayout>
      <SparePartForm sparePartLoaded={undefined} />
    </MainLayout>
  );
}

export default SparePartsFormPage;
