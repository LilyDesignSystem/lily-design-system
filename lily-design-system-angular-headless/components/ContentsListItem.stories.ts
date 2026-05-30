import type { Meta, StoryObj } from "@storybook/angular";
import { ContentsListItem } from "./ContentsListItem";

const meta: Meta<ContentsListItem> = {
  title: "Headless/ContentsListItem",
  component: ContentsListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ContentsListItem>;

export const Default: Story = {};
