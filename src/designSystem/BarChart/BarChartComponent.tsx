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
    <>
      <h3 className="text-lg font-medium">Ordres de treball del mes</h3>
      <BarChart
        className="mt-6"
        data={chartData}
        index={index}
        categories={category}
        colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </>
  );
}
