import Container from "components/layout/Container";
import LoginChecker from "components/layout/LoginChecker";
import MainLayout from "components/layout/MainLayout";
import SignOperator from "components/operator/SignOperator";
import WorkOrderComponent from "components/workOrders/WorkOrderComponent";
import DasboardPage from "./dasboard/page";
import GeneratePreventive from "../preventive/components/GeneratePreventive";
import FinalizeWorkOrdersDaysBefore from "../workOrders/components/FinalizeWorkOrdersDaysBefore";

export default function MenuPage() {
  return (
    <MainLayout>
      <Container>
        <LoginChecker>
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-row gap-4 items-start">
              <SignOperator />
              <GeneratePreventive />
              <FinalizeWorkOrdersDaysBefore />
            </div>
            <div>
              <WorkOrderComponent />
            </div>
            <div>
              <DasboardPage />
            </div>
          </div>
        </LoginChecker>
      </Container>
    </MainLayout>
  );
}
