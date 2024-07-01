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
    <div className="w-full flex flex-col justify-center items-center ">
      <p className="text-lg font-medium">Ordres de treball per operari</p>
      <BarChart
        className="mt-6"
        data={chartData}
        index={index}
        categories={category}
        colors={["blue", "rose"]}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </div>
  );
}
