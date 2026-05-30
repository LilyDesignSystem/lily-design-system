import type { Meta, StoryObj } from "@storybook/angular";
import { TimeoutDialog } from "./TimeoutDialog";

const meta: Meta<TimeoutDialog> = {
  title: "Headless/TimeoutDialog",
  component: TimeoutDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TimeoutDialog>;

export const Default: Story = {};
