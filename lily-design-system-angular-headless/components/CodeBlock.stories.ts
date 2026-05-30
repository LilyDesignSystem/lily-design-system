import type { Meta, StoryObj } from "@storybook/angular";
import { CodeBlock } from "./CodeBlock";

const meta: Meta<CodeBlock> = {
  title: "Headless/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CodeBlock>;

export const Default: Story = {};
