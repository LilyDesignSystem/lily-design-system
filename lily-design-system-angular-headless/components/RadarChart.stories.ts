import type { Meta, StoryObj } from "@storybook/angular";
import { RadarChart } from "./RadarChart";

const meta: Meta<RadarChart> = {
  title: "Headless/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RadarChart>;

export const Default: Story = { args: { label: "Radar chart" } };
