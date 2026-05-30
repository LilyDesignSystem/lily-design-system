import type { Meta, StoryObj } from "@storybook/angular";
import { TreeListItem } from "./TreeListItem";

const meta: Meta<TreeListItem> = {
  title: "Headless/TreeListItem",
  component: TreeListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TreeListItem>;

export const Default: Story = {};
