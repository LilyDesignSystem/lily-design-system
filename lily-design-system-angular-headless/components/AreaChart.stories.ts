import type { Meta, StoryObj } from "@storybook/angular";
import { AreaChart } from "./AreaChart";

const meta: Meta<AreaChart> = {
  title: "Headless/AreaChart",
  component: AreaChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AreaChart>;

export const Default: Story = {};
