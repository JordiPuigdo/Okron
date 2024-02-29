import MainLayout from "components/layout/MainLayout";
import AuthenticationPage from "./(pages)/authentication/page";
import Container from "components/layout/Container";
import { Metadata } from "next";
import LoginChecker from "components/layout/LoginChecker";

export const metadata: Metadata = {
  metadataBase: new URL("https://okron.io"),
  title: "Okron - Gmao & Warehouse",
};
export default function Page() {
  return (
    <MainLayout hideHeader>
      <LoginChecker isLoginPage>
        <AuthenticationPage />
      </LoginChecker>
    </MainLayout>
  );
}
