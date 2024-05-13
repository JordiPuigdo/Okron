import Container from "components/layout/Container";
import LoginChecker from "components/layout/LoginChecker";
import MainLayout from "components/layout/MainLayout";
import SignOperator from "components/operator/SignOperator";
import WorkOrderComponent from "components/workOrders/WorkOrderComponent";
import GeneratePreventive from "../preventive/components/GeneratePreventive";
import FinalizeWorkOrdersDaysBefore from "../workOrders/components/FinalizeWorkOrdersDaysBefore";
import DashboardPage from "./dashboard/page";

export default function MenuPage() {
  return (
    <MainLayout>
      <Container>
        <LoginChecker>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row gap-4 items-start">
              <SignOperator />
              <GeneratePreventive />
              <FinalizeWorkOrdersDaysBefore />
            </div>
            <div>
              <WorkOrderComponent />
            </div>
            <div>
              <DashboardPage />
            </div>
          </div>
        </LoginChecker>
      </Container>
    </MainLayout>
  );
}
