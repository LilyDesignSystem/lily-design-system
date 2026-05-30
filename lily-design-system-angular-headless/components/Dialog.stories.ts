import type { Meta, StoryObj } from "@storybook/angular";
import { Dialog } from "./Dialog";

const meta: Meta<Dialog> = {
  title: "Headless/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Dialog>;

export const Default: Story = {};
