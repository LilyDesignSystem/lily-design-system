import type { Meta, StoryObj } from "@storybook/angular";
import { CollectionListItem } from "./CollectionListItem";

const meta: Meta<CollectionListItem> = {
  title: "Headless/CollectionListItem",
  component: CollectionListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CollectionListItem>;

export const Default: Story = {};
