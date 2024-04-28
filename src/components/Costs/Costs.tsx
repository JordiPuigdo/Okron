interface CostsProps {
  operatorCosts: number;
  sparePartCosts: number;
  totalCosts: number;
}

export function CostsWorkOrder({
  operatorCosts,
  sparePartCosts,
  totalCosts,
}: CostsProps) {
  return (
    <div className="flex flex-row mx-auto max-w-md bg-gray-200 rounded-lg border border-gray-600 p-4 ">
      <div className="mt-auto w-full">
        <p className="font-semibold text-lg">Cost Total</p>
        <p className="font-semibold text-2xl">{totalCosts}€</p>
      </div>
      <div className="w-full text-right">
        <p className="font-semibold text-lg">Recanvis</p>
        <p className="font-semibold text-2xl">{sparePartCosts}€</p>
        <p className="font-semibold text-lg">Operaris</p>
        <p className="font-semibold text-2xl">{operatorCosts}€</p>
      </div>
    </div>
  );
}
