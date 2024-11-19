import { WorkOrderType } from 'app/interfaces/workOrder';
import { translateWorkOrderType } from 'app/utils/utils';
import DonutChart from './DonutChart';
export interface DonutChartComponentProps {
  chartData: any[];
  title: string;
}

export const DonutChartComponent = ({
  chartData,
  title,
}: DonutChartComponentProps) => (
  <div className="w-full flex flex-col p-4">
    <p className="text-2xl font-semibold text-left">{title}</p>
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center w-full">
        <DonutChart chartData={chartData} />
      </div>
      <div className="flex flex-col items-end w-full space-y-2">
        {chartData.map(item => (
          <div key={item.name} className="flex items-center space-x-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                item.workOrderType === WorkOrderType.Preventive
                  ? 'bg-blue-500'
                  : 'bg-red-500'
              }`}
            ></span>
            <span className="font-sm text-gray-500 text-sm">
              {translateWorkOrderType(item.workOrderType as WorkOrderType)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
