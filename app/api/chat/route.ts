import { cerebras } from "@ai-sdk/cerebras";
import { streamText, tool } from "ai";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: cerebras("llama3.1-70b"),
    messages,
    system: `You are an expert AI data analyst and assistant named Sisso. 
    You help users visualize data using Frappe Charts.
    Your tone is professional, minimalist, and refined, inspired by high-end architectural design.
    
    When a user asks for data analysis or visualization, use the 'renderChart' tool to generate the appropriate chart.
    You can render various chart types: 'bar', 'line', 'scatter', 'pie', 'percentage', 'axis-mixed', 'heatmap'.
    
    Frappe Charts capabilities:
    - axis-mixed: Each dataset can have a 'chartType' of 'bar' or 'line'.
    - Heatmaps: Provide 'dataPoints' (object mapping Unix timestamps to values), 'start' (Unix timestamp), 'end' (Unix timestamp).
    - Annotations: Use 'yMarkers' and 'yRegions' for context.
    - Configuration: 'axisOptions', 'barOptions', 'lineOptions' for fine control.
    
    Data structure for 'renderChart':
    - title: string
    - type: 'bar' | 'line' | 'scatter' | 'pie' | 'percentage' | 'axis-mixed' | 'heatmap'
    - data: { 
        labels?: string[], 
        datasets?: { name: string, values: number[], chartType?: string }[],
        dataPoints?: { [key: string]: number },
        start?: number, // Unix timestamp in seconds
        end?: number, // Unix timestamp in seconds
        yMarkers?: { label: string, value: number, options?: { labelPos: 'left' | 'right' } }[],
        yRegions?: { label: string, start: number, end: number, options?: { labelPos: 'left' | 'right' } }[]
      }
    - height: number (default 250)
    - colors: string[] (use refined: ['#1c1917', '#a8a29e', '#44403c', '#d6d3d1'])
    - axisOptions: { xIsSeries?: boolean, xAxisMode?: 'tick' | 'span', yAxisMode?: 'tick' | 'span' }
    - lineOptions: { regionFill?: boolean, hideDots?: boolean, hideLine?: boolean, heatline?: boolean, spline?: boolean, dotSize?: number }
    - barOptions: { spaceRatio?: number, stacked?: boolean, height?: number }
    
    Example for axis-mixed with annotations:
    {
      "title": "Market Trend & Capacity",
      "type": "axis-mixed",
      "data": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
        "datasets": [
          { "name": "Growth", "values": [12, 18, 15, 25, 22], "chartType": "bar" },
          { "name": "Target", "values": [15, 15, 15, 20, 20], "chartType": "line" }
        ],
        "yMarkers": [{ "label": "Threshold", "value": 18, "options": { "labelPos": "left" } }]
      }
    }
    
    Always provide a helpful and concise explanation of the chart you're rendering.
    Maintain the 'Novera' philosophy: Light over noise, materials with intention, silence as a feature.`,
    tools: {
      renderChart: tool({
        description: "Render a Frappe Chart based on data provided.",
        parameters: z.object({
          title: z.string().optional(),
          type: z.enum(["bar", "line", "scatter", "pie", "percentage", "axis-mixed", "heatmap"]),
          data: z.object({
            labels: z.array(z.string()).optional(),
            datasets: z.array(z.object({
              name: z.string().optional(),
              values: z.array(z.number()),
              chartType: z.enum(["bar", "line"]).optional(),
            })).optional(),
            dataPoints: z.record(z.string(), z.number()).optional(),
            start: z.number().optional(),
            end: z.number().optional(),
            yMarkers: z.array(z.object({
              label: z.string(),
              value: z.number(),
              options: z.object({ labelPos: z.enum(["left", "right"]) }).optional(),
            })).optional(),
            yRegions: z.array(z.object({
              label: z.string(),
              start: z.number(),
              end: z.number(),
              options: z.object({ labelPos: z.enum(["left", "right"]) }).optional(),
            })).optional(),
          }),
          height: z.number().optional().default(250),
          colors: z.array(z.string()).optional(),
          axisOptions: z.object({
            xIsSeries: z.boolean().optional(),
            xAxisMode: z.enum(["tick", "span"]).optional(),
            yAxisMode: z.enum(["tick", "span"]).optional(),
          }).optional(),
          lineOptions: z.object({
            regionFill: z.boolean().optional(),
            hideDots: z.boolean().optional(),
            hideLine: z.boolean().optional(),
            heatline: z.boolean().optional(),
            spline: z.boolean().optional(),
            dotSize: z.number().optional(),
          }).optional(),
          barOptions: z.object({
            spaceRatio: z.number().optional(),
            stacked: z.boolean().optional(),
            height: z.number().optional(),
          }).optional(),
        }),
      }),
    },
  });

  return result.toDataStreamResponse();
}
