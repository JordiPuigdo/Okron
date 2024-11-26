import Container from 'components/layout/Container';
import MainLayout from 'components/layout/MainLayout';

import WorkOrderTable from './components/WorkOrderTable';
import { SvgMachines } from 'app/icons/icons';

export default function WorkOrdersPage() {
  const renderHeader = () => {
    return (
      <div className="flex p-2 my-2">
        <div className="w-full flex flex-col gap-2  justify-between">
          <h2 className="text-2xl font-bold text-black flex gap-2 flex-grow">
            <SvgMachines />
            Ordres de treball
          </h2>
          <span className="text-l self-start">
            Inici - Històric Ordres de treball
          </span>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <Container>
        {renderHeader()}
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
