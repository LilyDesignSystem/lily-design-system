import type { Meta, StoryObj } from "@storybook/angular";
import { ToolCall } from "./ToolCall";

const meta: Meta<ToolCall> = {
  title: "Headless/ToolCall",
  component: ToolCall,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolCall>;

export const Default: Story = {};
