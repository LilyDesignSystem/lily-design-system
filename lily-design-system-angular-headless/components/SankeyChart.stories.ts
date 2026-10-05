import type { Meta, StoryObj } from "@storybook/angular";
import { SankeyChart } from "./SankeyChart";

const meta: Meta<SankeyChart> = {
  title: "Headless/SankeyChart",
  component: SankeyChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SankeyChart>;

export const Default: Story = { args: { label: "Sankey chart" } };
