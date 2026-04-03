"use client";

import { useEffect, useRef } from "react";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

interface Dataset {
  name?: string;
  chartType?: string;
  values: number[];
}

interface Data {
  labels?: string[];
  datasets?: Dataset[];
  dataPoints?: { [key: string]: number }; // For heatmaps
  start?: Date; // For heatmaps
  end?: Date; // For heatmaps
  yMarkers?: { label: string; value: number; options?: { labelPos: "left" | "right" } }[];
  yRegions?: { label: string; start: number; end: number; options?: { labelPos: "left" | "right" } }[];
}

interface FrappeChartProps {
  title?: string;
  data: Data;
  type?: string;
  height?: number;
  colors?: string[];
  axisOptions?: {
    xIsSeries?: boolean;
    xAxisMode?: "tick" | "span";
    yAxisMode?: "tick" | "span";
  };
  barOptions?: {
    spaceRatio?: number;
    stacked?: boolean;
    height?: number;
  };
  lineOptions?: {
    regionFill?: boolean;
    hideDots?: boolean;
    hideLine?: boolean;
    heatline?: boolean;
    spline?: boolean;
    dotSize?: number;
  };
  isNavigable?: boolean;
  valuesOverPoints?: boolean;
  countLabel?: string;
  discreteDomains?: number;
}

export default function FrappeChart({
  title,
  data,
  type = "bar",
  height = 250,
  colors = ["#1c1917", "#a8a29e", "#44403c"],
  ...props
}: FrappeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Small delay to ensure container is ready
      const timer = setTimeout(() => {
        try {
          chartInstance.current = new Chart(chartRef.current, {
            title,
            data,
            type,
            height,
            colors,
            ...props,
          });
        } catch (e) {
          console.error("Frappe Chart initialization failed:", e);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [data, title, type, height, colors, props]);

  return <div ref={chartRef} className="w-full frappe-chart-container" />;
}
