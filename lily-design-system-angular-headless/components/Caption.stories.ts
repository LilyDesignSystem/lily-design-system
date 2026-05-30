import type { Meta, StoryObj } from "@storybook/angular";
import { Caption } from "./Caption";

const meta: Meta<Caption> = {
  title: "Headless/Caption",
  component: Caption,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Caption>;

export const Default: Story = {};
