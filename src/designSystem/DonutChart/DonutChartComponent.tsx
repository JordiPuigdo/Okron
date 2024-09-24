import { DonutChart, List, ListItem } from "@tremor/react";
import { WorkOrderType } from "app/interfaces/workOrder";
import { translateWorkOrderType } from "app/utils/utils";

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
  <div className="w-full flex flex-col items-center p-4 space-y-4">
    <p className="text-lg font-semibold text-center">{title}</p>

    <div className="flex w-full space-x-4 p-2 items-center">
      <div className="flex-1 flex flex-col space-y-3 p-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-block w-5 h-5 rounded-full ${
                  item.workOrderType === WorkOrderType.Preventive
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              ></span>
              <span className="font-medium text-gray-700">
                {translateWorkOrderType(item.workOrderType as WorkOrderType)}
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-white p-4 ">
        <DonutChart
          data={chartData}
          index={index}
          variant="pie"
          colors={["blue", "rose"]}
          valueFormatter={dataFormatter}
          onValueChange={(v) => console.log(v)}
          className="text-black"
          noDataText="No hi ha resultats amb aquests filtres"
        />
      </div>
    </div>
  </div>
);
