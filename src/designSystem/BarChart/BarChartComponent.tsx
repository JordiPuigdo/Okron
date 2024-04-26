import { BarChart } from "@tremor/react";

const chartdata = [
  {
    name: "Xevi",
    Preventius: 2,
    Correctius: 15,
  },
  {
    name: "Jose",
    Preventius: 2,
    Correctius: 3,
  },
  {
    name: "EMERSON",
    Preventius: 0,
    Correctius: 3,
  },
  {
    name: "AMIR",
    Preventius: 0,
    Correctius: 2,
  },
];

const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export function BarChartComponent() {
  return (
    <>
      <h3 className="text-lg font-medium">Ordres de treball del mes</h3>
      <BarChart
        className="mt-6"
        data={chartdata}
        index="name"
        categories={["Preventius", "Correctius"]}
        colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
        valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </>
  );
}
