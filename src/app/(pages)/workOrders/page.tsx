'use client';

import Container from 'components/layout/Container';
import MainLayout from 'components/layout/MainLayout';

import WorkOrderTable from './components/WorkOrderTable';
import { SvgMachines } from 'app/icons/icons';
import { useSessionStore } from 'app/stores/globalStore';
import { UserType } from 'app/interfaces/User';

export default function WorkOrdersPage() {
  const { loginUser } = useSessionStore(state => state);
  const renderHeader = () => {
    const name =
      loginUser?.userType == UserType.Maintenance
        ? 'Ordres de treball'
        : 'Tiquets';
    return (
      <div className="flex w-full">
        <div className="w-full flex flex-col gap-2 items">
          <h2 className="text-2xl font-bold text-black flex gap-2">
            <SvgMachines />
            {name}
          </h2>
          <span className="text-l">Inici - Llistat de {name}</span>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <Container>
        {renderHeader()}
        <div className="mt-4">
          <WorkOrderTable
            enableFilterAssets={true}
            enableFilters={true}
            enableEdit={true}
            enableDelete={true}
            enableFinalizeWorkOrdersDayBefore={
              loginUser?.userType == UserType.Maintenance ? true : false
            }
          />
        </div>
      </Container>
    </MainLayout>
  );
}
