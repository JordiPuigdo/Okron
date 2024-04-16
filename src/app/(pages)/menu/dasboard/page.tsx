"use client";
import { BarChartComponent } from "designSystem/BarChart/BarChartComponent";
import { DonutChartComponent } from "designSystem/DonutChart/DonutChartComponent";

export default function DasboardPage() {
  return (
    <>
      <div className="flex flex-row gap-12 w-full items-center bg-white p-4 rounded-xl">
        <BarChartComponent />
        <DonutChartComponent />
      </div>
    </>
  );
}
