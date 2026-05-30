import type { Meta, StoryObj } from "@storybook/angular";
import { CheckListItem } from "./CheckListItem";

const meta: Meta<CheckListItem> = {
  title: "Headless/CheckListItem",
  component: CheckListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CheckListItem>;

export const Default: Story = {};
