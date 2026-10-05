import type { Meta, StoryObj } from "@storybook/angular";
import { GaugeChart } from "./GaugeChart";

const meta: Meta<GaugeChart> = {
  title: "Headless/GaugeChart",
  component: GaugeChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GaugeChart>;

export const Default: Story = { args: { label: "Gauge chart" } };
