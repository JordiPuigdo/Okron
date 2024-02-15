import Layout from "components/Layout";
import SparePartForm from "./sparePartForm";

function SparePartsFormPage() {
  return (
    <Layout>
      <SparePartForm sparePartLoaded={undefined} />
    </Layout>
  );
}

export default SparePartsFormPage;
