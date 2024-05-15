"use client";
import Container from "components/layout/Container";
import LoginChecker from "components/layout/LoginChecker";
import MainLayout from "components/layout/MainLayout";
import SignOperator from "components/operator/SignOperator";
import WorkOrderComponent from "components/workOrders/WorkOrderComponent";
import GeneratePreventive from "../preventive/components/GeneratePreventive";
import FinalizeWorkOrdersDaysBefore from "../workOrders/components/FinalizeWorkOrdersDaysBefore";
import DashboardPage from "./dashboard/page";
import FilterWOType from "../workOrders/[id]/components/FilterWOType";
import { WorkOrderType } from "app/interfaces/workOrder";
import { useState } from "react";
import { HeaderMenu } from "./dashboard/components/HeaderMenu";

export default function MenuPage() {
  const [type, setType] = useState<WorkOrderType>(WorkOrderType.Corrective);
  function handleFilterWOType(type: WorkOrderType) {
    console.log(type);
  }

  return (
    <MainLayout>
      <Container>
        <LoginChecker>
          <div className="flex flex-col gap-2 w-full">
            <HeaderMenu />
            <div>
              <DashboardPage />
            </div>
          </div>
        </LoginChecker>
      </Container>
    </MainLayout>
  );
}
