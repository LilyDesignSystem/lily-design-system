import type { Meta, StoryObj } from "@storybook/angular";
import { ToolCallName } from "./ToolCallName";

const meta: Meta<ToolCallName> = {
  title: "Headless/ToolCallName",
  component: ToolCallName,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolCallName>;

export const Default: Story = {};
