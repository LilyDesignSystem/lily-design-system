import type { Meta, StoryObj } from "@storybook/angular";
import { ContentBlock } from "./ContentBlock";

const meta: Meta<ContentBlock> = {
  title: "Headless/ContentBlock",
  component: ContentBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContentBlock>;

export const Default: Story = {};
