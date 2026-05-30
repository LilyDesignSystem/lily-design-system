import type { Meta, StoryObj } from "@storybook/angular";
import { PopconfirmDialog } from "./PopconfirmDialog";

const meta: Meta<PopconfirmDialog> = {
  title: "Headless/PopconfirmDialog",
  component: PopconfirmDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PopconfirmDialog>;

export const Default: Story = {};
