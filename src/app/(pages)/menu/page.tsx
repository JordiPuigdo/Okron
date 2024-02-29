import Container from "components/layout/Container";
import LoginChecker from "components/layout/LoginChecker";
import MainLayout from "components/layout/MainLayout";
import SignOperator from "components/operator/SignOperator";

export default function MenuPage() {
  return (
    <MainLayout>
      <LoginChecker>
        <Container>
          <SignOperator />
        </Container>
      </LoginChecker>
    </MainLayout>
  );
}
