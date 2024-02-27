import MainLayout from "components/layout/MainLayout";
import AuthenticationPage from "./(pages)/authentication/page";
import Container from "components/layout/Container";

export default function Page() {
  return (
    <MainLayout hideHeader>
      <Container enablePading={false}>
        <AuthenticationPage />
      </Container>
    </MainLayout>
  );
}
