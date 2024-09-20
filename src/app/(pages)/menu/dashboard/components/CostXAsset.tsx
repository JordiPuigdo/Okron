import WorkOrder from "app/interfaces/workOrder";
import { BarChartComponent } from "designSystem/BarChart/BarChartComponent";

interface CostXAssetProps {
  workOrders: WorkOrder[];
}

const CostXAsset: React.FC<CostXAssetProps> = ({ workOrders }) => {
  const chartData = workOrders
    .map((workOrder) => {
      const totalCost = workOrder.workOrderSpareParts?.reduce(
        (acc, sparePart) => acc + sparePart.quantity * 23.4,
        0
      );
      return {
        asset: workOrder.asset?.description || "Unknown Asset",
        totalCost: totalCost || 0,
      };
    })
    .filter((item) => item.totalCost > 0)
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 10);

  return (
    <BarChartComponent
      category={["totalCost"]}
      chartData={chartData}
      index="asset"
      title="Cost Material per Equip"
      showLegend={false}
    />
  );
};

export default CostXAsset;
