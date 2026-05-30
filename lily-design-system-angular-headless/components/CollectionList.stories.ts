import type { Meta, StoryObj } from "@storybook/angular";
import { CollectionList } from "./CollectionList";

const meta: Meta<CollectionList> = {
  title: "Headless/CollectionList",
  component: CollectionList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CollectionList>;

export const Default: Story = {};
