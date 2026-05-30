import type { Meta, StoryObj } from "@storybook/angular";
import { Alert } from "./Alert";

const meta: Meta<Alert> = {
  title: "Headless/Alert",
  component: Alert,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Alert>;

export const Default: Story = {};
