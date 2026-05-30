import type { Meta, StoryObj } from "@storybook/angular";
import { GraphicBlock } from "./GraphicBlock";

const meta: Meta<GraphicBlock> = {
  title: "Headless/GraphicBlock",
  component: GraphicBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<GraphicBlock>;

export const Default: Story = {};
