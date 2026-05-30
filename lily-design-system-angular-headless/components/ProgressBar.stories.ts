import type { Meta, StoryObj } from "@storybook/angular";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<ProgressBar> = {
  title: "Headless/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ProgressBar>;

export const Default: Story = {};
