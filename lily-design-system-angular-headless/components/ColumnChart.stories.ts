import type { Meta, StoryObj } from "@storybook/angular";
import { ColumnChart } from "./ColumnChart";

const meta: Meta<ColumnChart> = {
  title: "Headless/ColumnChart",
  component: ColumnChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColumnChart>;

export const Default: Story = {};
