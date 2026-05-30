import type { Meta, StoryObj } from "@storybook/angular";
import { ProgressCircle } from "./ProgressCircle";

const meta: Meta<ProgressCircle> = {
  title: "Headless/ProgressCircle",
  component: ProgressCircle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProgressCircle>;

export const Default: Story = {};
