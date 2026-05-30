import type { Meta, StoryObj } from "@storybook/angular";
import { TreeNav } from "./TreeNav";

const meta: Meta<TreeNav> = {
  title: "Headless/TreeNav",
  component: TreeNav,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TreeNav>;

export const Default: Story = {};
