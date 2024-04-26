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

export const DonutChartComponent = () => (
  <>
    <div className="mx-auto space-y-12">
      <div className="space-y-3">
        <span className="text-center block font-semibold ">
          Correctius vs Preventius mensual
        </span>
        <div className="flex justify-center">
          <DonutChart
            data={datahero}
            variant="donut"
            valueFormatter={dataFormatter}
            onValueChange={(v) => console.log(v)}
            className="text-black"
          />
        </div>
      </div>
    </div>
  </>
);
