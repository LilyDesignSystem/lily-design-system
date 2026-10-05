import type { Meta, StoryObj } from "@storybook/angular";
import { ToolCallInput } from "./ToolCallInput";

const meta: Meta<ToolCallInput> = {
  title: "Headless/ToolCallInput",
  component: ToolCallInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolCallInput>;

export const Default: Story = {};
