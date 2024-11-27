'use client';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Downtime {
  originalType: string; // 'Maintenance' or 'Production'
  start: string;
  end: string;
}

interface Ticket {
  workOrder: string;
  asset: string;
  downtimeReason: string;
  downtimes: Downtime[];
}

interface DowntimeReportProps {
  tickets: Ticket[];
}

// Helper: Group downtimes by asset or downtime reason
const groupDowntimes = (
  tickets: Ticket[],
  groupBy: 'asset' | 'downtimeReason'
) => {
  const grouped: Record<string, Record<string, number>> = {}; // Nested object to store downtime reasons dynamically

  tickets.forEach(ticket => {
    const groupKey = ticket['asset']; // Dynamically group by asset or downtimeReason
    if (groupBy === 'asset') {
      if (!grouped[groupKey]) {
        grouped[groupKey] = { maintenance: 0, production: 0 };
      }
      ticket.downtimes.forEach(downtime => {
        const start = new Date(downtime.start).getTime();
        const end = new Date(downtime.end).getTime();
        const duration = (end - start) / 60000; // Convert to minutes

        if (downtime.originalType === 'Maintenance') {
          grouped[groupKey].maintenance += duration;
        } else if (downtime.originalType === 'Production') {
          grouped[groupKey].production += duration;
        }
      });
    } else {
      // Initialize the group if it doesn't exist
      if (!grouped[groupKey]) {
        grouped[groupKey] = {};
      }

      const downtimeReason = ticket.downtimeReason;
      ticket.downtimes.forEach(downtime => {
        const start = new Date(downtime.start).getTime();
        const end = new Date(downtime.end).getTime();
        const duration = (end - start) / 60000; // Convert to minutes

        const reasonKey = downtimeReason; // Use the downtime reason as a key

        // Initialize downtime reason if it doesn't exist for the current group
        if (!grouped[groupKey][reasonKey]) {
          grouped[groupKey][reasonKey] = 0;
        }

        // Add the downtime duration for the reason
        grouped[groupKey][reasonKey] += duration;
      });
    }
  });

  return grouped;
};

const DowntimeReport: React.FC<DowntimeReportProps> = ({ tickets }) => {
  const [groupBy, setGroupBy] = useState<'asset' | 'downtimeReason'>('asset');
  const groupedData = groupDowntimes(tickets, groupBy);

  const handleGroupByAsset = () => setGroupBy('asset');
  const handleGroupByDowntimeReason = () => setGroupBy('downtimeReason');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Report Aturades
      </h1>

      {/* Filter Buttons */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={handleGroupByAsset}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${
            groupBy === 'asset' ? 'bg-blue-600' : 'bg-gray-400'
          } hover:bg-blue-500 transition`}
        >
          Equip
        </button>
        <button
          onClick={handleGroupByDowntimeReason}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${
            groupBy === 'downtimeReason' ? 'bg-blue-600' : 'bg-gray-400'
          } hover:bg-blue-500 transition`}
        >
          Motiu Aturada
        </button>
      </div>

      {Object.keys(groupedData).length === 0 ? (
        <p className="text-center text-gray-500">No downtime data available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(groupedData).map(([key, data], index) => {
            let totalDowntime = 0;
            let chartData: any[] = [];

            if (groupBy === 'asset') {
              totalDowntime = data.maintenance + data.production;
            } else {
              if (data) {
                Object.entries(data).forEach(([type, downtime]) => {
                  totalDowntime += downtime;
                  chartData.push({
                    name: type,
                    value: downtime,
                  });
                });
              }
            }

            const generateRandomColor = () => {
              const randomColor = Math.floor(Math.random() * 16777215).toString(
                16
              ); // Generates a random integer and converts it to hex
              return `#${randomColor.padStart(6, '0')}`; // Ensure the hex code is 6 digits long
            };

            // Existing COLORS array
            const COLORS = ['#4C97FF', '#FF4C6D'];

            // Generate 15 random colors and add to the COLORS array
            const randomColors = Array.from(
              { length: chartData.length },
              generateRandomColor
            );

            // Combine the existing colors with the random ones
            const allColors = [...COLORS, ...randomColors];

            if (groupBy === 'asset') {
              chartData = [
                {
                  category: 'Maintenance',
                  value: data.maintenance,
                },
                {
                  category: 'Production',
                  value: data.production,
                },
              ];
            }

            return (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl shadow-xl p-6 bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
              >
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                  {key}
                </h2>
                <div className="space-y-4">
                  {/* Donut Chart with Gradient Styling */}
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60} // Creates the donut effect
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        paddingAngle={5}
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={allColors[index % allColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Downtime Summary */}
                  <div className="text-center text-gray-700 mt-4">
                    <p className="text-lg font-semibold">
                      <strong>Total:</strong> {totalDowntime.toFixed(2)} minuts
                    </p>
                    {groupBy === 'asset' ? (
                      <p className="text-sm text-gray-500">
                        ({((data.maintenance / totalDowntime) * 100).toFixed(1)}
                        % Manteniment,{' '}
                        {((data.production / totalDowntime) * 100).toFixed(1)}%
                        Producció)
                      </p>
                    ) : (
                      <>
                        {chartData.length > 0 &&
                          chartData.map((data, index) => (
                            <p key={index} className="text-sm text-gray-500">
                              {((data.value / totalDowntime) * 100).toFixed(1)}%
                              - {data.name}
                            </p>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DowntimeReport;
