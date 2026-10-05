import type { Meta, StoryObj } from "@storybook/angular";
import { HeatmapChart } from "./HeatmapChart";

const meta: Meta<HeatmapChart> = {
  title: "Headless/HeatmapChart",
  component: HeatmapChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<HeatmapChart>;

export const Default: Story = { args: { label: "Heatmap chart" } };
