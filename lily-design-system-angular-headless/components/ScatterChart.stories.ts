import type { Meta, StoryObj } from "@storybook/angular";
import { ScatterChart } from "./ScatterChart";

const meta: Meta<ScatterChart> = {
  title: "Headless/ScatterChart",
  component: ScatterChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ScatterChart>;

export const Default: Story = {};
