import type { Meta, StoryObj } from "@storybook/angular";
import { TreeMenu } from "./TreeMenu";

const meta: Meta<TreeMenu> = {
  title: "Headless/TreeMenu",
  component: TreeMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TreeMenu>;

export const Default: Story = {};
