import type { Meta, StoryObj } from "@storybook/angular";
import { PaginationListItem } from "./PaginationListItem";

const meta: Meta<PaginationListItem> = {
  title: "Headless/PaginationListItem",
  component: PaginationListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<PaginationListItem>;

export const Default: Story = {};
