import type { Meta, StoryObj } from "@storybook/angular";
import { ToolBar } from "./ToolBar";

const meta: Meta<ToolBar> = {
  title: "Headless/ToolBar",
  component: ToolBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToolBar>;

export const Default: Story = {};
