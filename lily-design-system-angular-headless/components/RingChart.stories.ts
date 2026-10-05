import type { Meta, StoryObj } from "@storybook/angular";
import { RingChart } from "./RingChart";

const meta: Meta<RingChart> = {
  title: "Headless/RingChart",
  component: RingChart,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RingChart>;

export const Default: Story = {};
