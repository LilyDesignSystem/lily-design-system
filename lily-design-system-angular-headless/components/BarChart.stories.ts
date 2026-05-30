import type { Meta, StoryObj } from "@storybook/angular";
import { BarChart } from "./BarChart";

const meta: Meta<BarChart> = {
  title: "Headless/BarChart",
  component: BarChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<BarChart>;

export const Default: Story = {};
