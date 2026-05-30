import type { Meta, StoryObj } from "@storybook/angular";
import { TreeLink } from "./TreeLink";

const meta: Meta<TreeLink> = {
  title: "Headless/TreeLink",
  component: TreeLink,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TreeLink>;

export const Default: Story = {};
