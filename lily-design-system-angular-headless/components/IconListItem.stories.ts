import type { Meta, StoryObj } from "@storybook/angular";
import { IconListItem } from "./IconListItem";

const meta: Meta<IconListItem> = {
  title: "Headless/IconListItem",
  component: IconListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IconListItem>;

export const Default: Story = {};
