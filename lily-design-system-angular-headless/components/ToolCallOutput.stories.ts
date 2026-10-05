import type { Meta, StoryObj } from "@storybook/angular";
import { ToolCallOutput } from "./ToolCallOutput";

const meta: Meta<ToolCallOutput> = {
  title: "Headless/ToolCallOutput",
  component: ToolCallOutput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolCallOutput>;

export const Default: Story = {};
