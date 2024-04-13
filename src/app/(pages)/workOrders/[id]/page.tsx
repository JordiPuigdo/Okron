import WorkOrderEditForm from "./components/workOrderEditForm";
import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";

export default function EditWorkOrder({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <Container>
        <WorkOrderEditForm id={params.id} />
      </Container>
    </MainLayout>
  );
}
