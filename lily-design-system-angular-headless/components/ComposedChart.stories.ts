import type { Meta, StoryObj } from "@storybook/angular";
import { ComposedChart } from "./ComposedChart";

const meta: Meta<ComposedChart> = {
  title: "Headless/ComposedChart",
  component: ComposedChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ComposedChart>;

export const Default: Story = {};
