import { OrderItemRequest } from 'app/interfaces/Order';

interface OrderDetailItemsProps {
  items: OrderItemRequest[];
  handleRemoveItem: (index: number) => void;
}

export default function OrderDetailItems({
  items,
  handleRemoveItem,
}: OrderDetailItemsProps) {
  return (
    <div>
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold">Llista de Recanvis</h3>
        <table className="w-full border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Recanvi</th>
              <th className="p-2 border">Proveïdor</th>
              <th className="p-2 border">Magatzem</th>
              <th className="p-2 border">Quantitat</th>
              <th className="p-2 border">Preu Unitari</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Acció</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              /* const sparePart = spareParts!.find(
                sp => sp.id === item.sparePartId
              );*/
              return (
                <tr key={index} className="border-t">
                  <td className="p-2 border">
                    {item.sparePart.code || 'Unknown'}
                  </td>
                  <td className="p-2 border text-center">{item.providerId}</td>
                  <td className="p-2 border text-center">{item.wareHouseId}</td>
                  <td className="p-2 border text-center">{item.quantity}</td>
                  <td className="p-2 border text-center">{item.unitPrice}€</td>
                  <td className="p-2 border text-center">
                    {(item.quantity * item.unitPrice).toFixed(2)}€
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="flex w-full bg-red-500 justify-center text-white px-2 py-1 rounded-md hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
