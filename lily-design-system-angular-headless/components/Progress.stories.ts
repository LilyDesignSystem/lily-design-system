import type { Meta, StoryObj } from "@storybook/angular";
import { Progress } from "./Progress";

const meta: Meta<Progress> = {
  title: "Headless/Progress",
  component: Progress,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Progress>;

export const Default: Story = {};
