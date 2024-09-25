import MainLayout from "components/layout/MainLayout";
import Container from "components/layout/Container";
import WorkOrderTable from "./components/WorkOrderTable";

export default function WorkOrdersPage() {
  const renderHeader = () => {
    return (
      <div className="flex px-4 sm:px-12 items-center flex-col sm:flex-row mb-8">
        <div className="cursor-pointer mb-4 sm:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 inline-block mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-black mx-auto">
          Històric Ordres de treball
        </h2>
      </div>
    );
  };

  return (
    <MainLayout>
      <Container>
        <div className="p-2">
          <p>Menu {">"} Ordres de treball</p>
        </div>
        <div className="mt-2">
          <WorkOrderTable
            enableFilterAssets={true}
            enableFilters={true}
            enableEdit={true}
            enableDelete={true}
            enableFinalizeWorkOrdersDayBefore={true}
          />
        </div>
      </Container>
    </MainLayout>
  );
}
