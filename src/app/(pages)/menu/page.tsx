import Container from "components/layout/Container";
import LoginChecker from "components/layout/LoginChecker";
import MainLayout from "components/layout/MainLayout";
import DashboardPage from "./dashboard/page";
import { HeaderMenu } from "./dashboard/components/HeaderMenu";

export default function MenuPage() {
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
