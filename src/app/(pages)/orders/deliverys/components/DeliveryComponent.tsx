import { HeaderTable } from 'components/layout/HeaderTable';

export default function DeliveryComponent() {
  return (
    <div>
      <HeaderTable
        title="Recepció"
        subtitle="Inici - Llistat de Recepcions"
        createButton="Crear Recepció"
        urlCreateButton="/orders/orderForm"
      />
    </div>
  );
}
