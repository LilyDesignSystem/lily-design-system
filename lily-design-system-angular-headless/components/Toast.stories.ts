import type { Meta, StoryObj } from "@storybook/angular";
import { Toast } from "./Toast";

const meta: Meta<Toast> = {
  title: "Headless/Toast",
  component: Toast,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Toast>;

export const Default: Story = {};
