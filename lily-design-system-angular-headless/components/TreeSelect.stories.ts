import type { Meta, StoryObj } from "@storybook/angular";
import { TreeSelect } from "./TreeSelect";

const meta: Meta<TreeSelect> = {
  title: "Headless/TreeSelect",
  component: TreeSelect,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TreeSelect>;

export const Default: Story = {};
