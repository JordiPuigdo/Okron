import Container from "components/layout/Container";
import MainLayout from "components/layout/MainLayout";
import SignOperator from "components/operator/SignOperator";

export default function MenuPage() {
  return (
    <MainLayout>
      <Container>
        <SignOperator />
      </Container>
    </MainLayout>
  );
}
