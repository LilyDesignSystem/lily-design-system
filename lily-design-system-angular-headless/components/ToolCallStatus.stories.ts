import type { Meta, StoryObj } from "@storybook/angular";
import { ToolCallStatus } from "./ToolCallStatus";

const meta: Meta<ToolCallStatus> = {
  title: "Headless/ToolCallStatus",
  component: ToolCallStatus,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolCallStatus>;

export const Default: Story = {};
