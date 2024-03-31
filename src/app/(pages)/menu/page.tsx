import Container from "components/layout/Container";
import LoginChecker from "components/layout/LoginChecker";
import MainLayout from "components/layout/MainLayout";
import SignOperator from "components/operator/SignOperator";
import WorkOrderComponent from "components/workOrders/WorkOrderComponent";

export default function MenuPage() {
  return (
    <MainLayout>
      <Container>
        <LoginChecker>
          <div className="flex flex-col gap-8 w-full">
            <div>
              <SignOperator />
            </div>
            <div>
              <WorkOrderComponent />
            </div>
          </div>
        </LoginChecker>
      </Container>
    </MainLayout>
  );
}
