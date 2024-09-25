import { BarChart } from "@tremor/react";

interface BarChartComponentProps {
  chartData: any[];
  index: string;
  category: string[];
  title: string;
  showLegend?: boolean;
}

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export function BarChartComponent({
  chartData,
  index,
  category,
  title,
  showLegend = true,
}: BarChartComponentProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <p className="text-lg font-medium">{title}</p>
      <BarChart
        className={`${!showLegend && "pt-8"}`} // Moves the chart down if no legend
        data={chartData}
        index={index}
        categories={category}
        colors={["blue", "rose"]}
        valueFormatter={dataFormatter}
        yAxisWidth={200} // Wider Y-axis
        showAnimation={true} // Smooth animation
        showTooltip={true} // Show tooltips on hover
        layout="vertical" // Optional: Vertical layout for bars
        showLegend={showLegend} // Show or hide legend
        noDataText="No hi ha resultats amb aquests filtres"
      />
    </div>
  );
}
