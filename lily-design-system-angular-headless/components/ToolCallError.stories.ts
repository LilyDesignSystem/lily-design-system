import type { Meta, StoryObj } from "@storybook/angular";
import { ToolCallError } from "./ToolCallError";

const meta: Meta<ToolCallError> = {
  title: "Headless/ToolCallError",
  component: ToolCallError,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolCallError>;

export const Default: Story = {};
