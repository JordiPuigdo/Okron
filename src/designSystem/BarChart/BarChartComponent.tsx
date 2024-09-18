import { BarChart } from "@tremor/react";

interface BarChartComponentProps {
  chartData: any[];
  index: string;
  category: string[];
}

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export function BarChartComponent({
  chartData,
  index,
  category,
}: BarChartComponentProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center p-2">
      <p className="text-lg font-medium">Ordres de treball per operari</p>
      <BarChart
        className=""
        data={chartData}
        index={index}
        categories={category}
        colors={["blue", "rose"]}
        valueFormatter={dataFormatter}
        yAxisWidth={200} // Slightly wider Y-axis for better readability
        showAnimation={true} // Adding smooth animation for better UX
        showTooltip={true} // Display tooltips on hover for better interactivity
        layout="vertical" // Optional: Use horizontal bars if preferred
      />
    </div>
  );
}
