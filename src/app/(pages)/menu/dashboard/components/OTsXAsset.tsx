import { AssetChartProps } from '../DashboardMM/DashboardMM';

export default function OTsXAsset({
  chartAssets,
}: {
  chartAssets: AssetChartProps[];
}) {
  return (
    <div>
      <p className="text-lg font-semibold mb-4 items-center w-full">
        Top Equips amb més Correctius
      </p>
      <ul className="grid grid-rows-3 gap-4 w-full">
        {chartAssets.map((asset, index) => (
          <li
            key={index}
            className="bg-gray-100 p-4 rounded-md shadow-md flex justify-between items-center gap-4"
          >
            <div>
              <span className="text-lg font-semibold">{asset.asset}</span>
              <span className="block text-sm text-gray-500">
                Total Correctius: {asset.Correctius}
              </span>
              <span className="block text-sm text-gray-500">
                Total Preventius: {asset.Preventius}
              </span>
              <span className="block text-sm text-gray-500">
                Total ordres de treball: {asset.number}
              </span>
            </div>
            {index === 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                1r
              </span>
            )}
            {index === 1 && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                2n
              </span>
            )}
            {index === 2 && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                3r
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
