import type { Meta, StoryObj } from "@storybook/angular";
import { Blockquote } from "./Blockquote";

const meta: Meta<Blockquote> = {
  title: "Headless/Blockquote",
  component: Blockquote,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Blockquote>;

export const Default: Story = {};
