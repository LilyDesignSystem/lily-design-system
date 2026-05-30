import type { Meta, StoryObj } from "@storybook/angular";
import { TreeList } from "./TreeList";

const meta: Meta<TreeList> = {
  title: "Headless/TreeList",
  component: TreeList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TreeList>;

export const Default: Story = {};
