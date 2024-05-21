import { DonutChart } from "@tremor/react";

const datahero = [
  {
    name: "Preventius",
    value: 13,
  },
  {
    name: "Correctius",
    value: 21,
  },
];

const dataFormatter = (number: number) => number.toLocaleString("es-ES");
export interface DonutChartComponentProps {
  chartData: any[];
  index: string;
  category: string[];
  title: string;
}

export const DonutChartComponent = ({
  chartData,
  index,
  category,
  title,
}: DonutChartComponentProps) => (
  <>
    <div className="flex flex-col w-full justify-center items-center gap-4">
      <p className="text-lg font-semibold">{title}</p>
      <DonutChart
        data={chartData}
        index={index}
        variant="pie"
        colors={["blue", "rose"]}
        valueFormatter={dataFormatter}
        onValueChange={(v) => console.log(v)}
        className="text-black"
      />
    </div>
  </>
);
