interface CostsProps {
  operatorCosts: number;
  sparePartCosts: number;
  totalCosts: number;
}

export function CostsObject({
  operatorCosts,
  sparePartCosts,
  totalCosts,
}: CostsProps) {
  return (
    <div className="flex-grow bg-white p-4 rounded-md shadow-md w-full">
      <div className="flex justify-between items-center mb-2 border-b-2">
        <div className="text-gray-700 text-xl">Cost Operaris:</div>
        <div className="text-blue-600 font-semibold text-xl">
          {operatorCosts}€
        </div>
      </div>

      <div className="flex justify-between items-center mb-2  border-b-2">
        <div className="text-gray-700 text-xl">Cost Recanvis:</div>
        <div className="text-blue-600 font-semibold text-xl">
          {sparePartCosts}€
        </div>
      </div>

      <div className="flex justify-between items-center font-semibold border-b-2">
        <div className="text-gray-700 text-xl">Cost Total:</div>
        <div className="text-red-600 font-semibold text-xl">{totalCosts}€</div>
      </div>
    </div>
  );
}
