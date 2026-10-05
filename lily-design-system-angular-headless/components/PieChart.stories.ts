import type { Meta, StoryObj } from "@storybook/angular";
import { PieChart } from "./PieChart";

const meta: Meta<PieChart> = {
  title: "Headless/PieChart",
  component: PieChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PieChart>;

export const Default: Story = {};
