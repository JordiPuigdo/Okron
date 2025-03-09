'use client';
import { useEffect, useState } from 'react';
import { useOrder } from 'app/hooks/useOrder';
import { useSparePartsHook } from 'app/hooks/useSparePartsHook';
import { useWareHouses } from 'app/hooks/useWareHouses';
import {
  OrderCreationRequest,
  OrderItemRequest,
  OrderStatus,
  OrderType,
} from 'app/interfaces/Order';
import SparePart from 'app/interfaces/SparePart';
import { useGlobalStore } from 'app/stores/globalStore';
import { translateOrderStatus } from 'app/utils/utilsOrder';
import Container from 'components/layout/Container';
import { HeaderForm } from 'components/layout/HeaderForm';
import MainLayout from 'components/layout/MainLayout';

import ModalOrderWareHouse from './components/ModalOrderWareHouse';
import OrderDetailItems from './components/OrderDetailItems';

interface OrderFormProps {
  params: { id: string };
}

export default function OrderFormPage({ params }: OrderFormProps) {
  const { setIsModalOpen, isModalOpen } = useGlobalStore(state => state);
  const { createOrder } = useOrder();
  const { spareParts } = useSparePartsHook(true);
  const { warehouses } = useWareHouses(true);
  const [searchText, setSearchText] = useState('');

  const [order, setOrder] = useState<OrderCreationRequest>({
    code: '',
    providerId: params.id,
    items: [],
    status: OrderStatus.Pending,
    type: OrderType.Delivery,
    comment: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [selectedSparePart, setSelectedSparePart] = useState<
    SparePart | undefined
  >(undefined);
  const [selectedWareHouseId, setSelectedWareHouseId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (selectedSparePart && selectedSparePart?.wareHouseId.length > 1) {
      setIsModalOpen(true);
      return;
    }
    if (selectedSparePart) {
      handleAddItem();
    }
  }, [selectedSparePart]);

  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  const onSelectedId = (id: string) => {
    setSelectedWareHouseId(id);
    handleAddOrderItem();
    setIsModalOpen(false);
  };

  const handleAddItem = () => {
    if (!selectedSparePart) return;
    const sparePart = spareParts!.find(sp => sp.id === selectedSparePart.id);
    if (!sparePart) return;
    if (sparePart.wareHouseId.length > 1) return;
    handleAddOrderItem();
  };

  const handleAddOrderItem = () => {
    if (!selectedSparePart) return;
    const newItem: OrderItemRequest = {
      sparePartId: selectedSparePart.id,
      sparePart: selectedSparePart,
      quantity,
      unitPrice,
      wareHouseId: selectedWareHouseId ? selectedWareHouseId : '',
    };

    setOrder(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setSelectedSparePart(undefined);
    setQuantity(1);
    setUnitPrice(0);
    setSearchText('');
  };

  function handleRemoveItem(index: number) {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  const handleCreateOrder = async () => {
    try {
      await createOrder(order);
      alert('Order created successfully!');
    } catch (error) {
      console.error(error);
      alert('Error creating order');
    }
  };
  const filteredSpareParts = spareParts?.filter(sp =>
    `${sp.code} - ${sp.description}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = spareParts?.find(sp => sp.id === selectedId);
    if (selected) {
      setSelectedSparePart(selected);
    }
  };

  return (
    <MainLayout>
      <Container>
        <div className="mt-4">
          <HeaderForm header="Crear Recepció" isCreate />
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold">Codi:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={order.code}
                  onChange={e => setOrder({ ...order, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Estat:</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={order.status}
                  onChange={e =>
                    setOrder({
                      ...order,
                      status: Number(e.target.value) as OrderStatus,
                    })
                  }
                >
                  {Object.values(OrderStatus)
                    .filter(value => typeof value === 'number')
                    .map(status => (
                      <option key={status} value={status}>
                        {translateOrderStatus(status as OrderStatus)}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold">Data:</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={order.date}
                  onChange={e => setOrder({ ...order, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Comentari:
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={order.comment}
                  onChange={e =>
                    setOrder({ ...order, comment: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="grid grid-cols-[6fr_1fr_1fr] gap-2 text-left pb-2">
                <h3 className="text-lg font-semibold">Afegir Recanvis</h3>
                <h3 className="text-lg font-semibold">Quantitat</h3>
                <h3 className="text-lg font-semibold">Acció</h3>
              </div>

              <div className="grid grid-cols-[6fr_1fr_1fr] gap-2">
                <div className="w-full relative">
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder="Buscar recanvis..."
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onFocus={() => setSearchText('')}
                  />

                  {searchText && (
                    <div className="absolute w-full mt-1 bg-white border rounded-md z-10 shadow-md">
                      <select
                        className="w-full p-2 border rounded-md"
                        onChange={handleChange}
                        value={selectedSparePart?.id || ''}
                        size={5}
                      >
                        <option value="">Selecciona un recanvi</option>
                        {filteredSpareParts?.map(sp => (
                          <option key={sp.id} value={sp.id}>
                            {sp.code} - {sp.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />

                <button
                  onClick={handleAddItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                >
                  Afegir
                </button>
              </div>
            </div>

            <OrderDetailItems
              handleRemoveItem={handleRemoveItem}
              items={order.items}
            />
            <button
              onClick={handleCreateOrder}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Crear Albarà
            </button>
          </div>
          {isModalOpen && (
            <ModalOrderWareHouse
              wareHouseIds={
                (selectedSparePart && selectedSparePart?.wareHouseId) || []
              }
              onSelectedId={onSelectedId}
              wareHouses={warehouses}
            />
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
