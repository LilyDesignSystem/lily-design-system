import type { Meta, StoryObj } from "@storybook/angular";
import { AlertDialog } from "./AlertDialog";

const meta: Meta<AlertDialog> = {
  title: "Headless/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AlertDialog>;

export const Default: Story = {};
