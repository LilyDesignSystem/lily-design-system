import type { Meta, StoryObj } from "@storybook/angular";
import { HeatmapChartWithYearOfDays } from "./HeatmapChartWithYearOfDays";

const meta: Meta<HeatmapChartWithYearOfDays> = {
  title: "Headless/HeatmapChartWithYearOfDays",
  component: HeatmapChartWithYearOfDays,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HeatmapChartWithYearOfDays>;

export const Default: Story = { args: { label: "Heatmap chart", year: 2026, weekStart: 0 } };
