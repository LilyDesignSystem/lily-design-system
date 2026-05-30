import type { Meta, StoryObj } from "@storybook/angular";
import { LineChart } from "./LineChart";

const meta: Meta<LineChart> = {
  title: "Headless/LineChart",
  component: LineChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<LineChart>;

export const Default: Story = {};
