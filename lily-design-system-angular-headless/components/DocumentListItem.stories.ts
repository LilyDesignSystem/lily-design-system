import type { Meta, StoryObj } from "@storybook/angular";
import { DocumentListItem } from "./DocumentListItem";

const meta: Meta<DocumentListItem> = {
  title: "Headless/DocumentListItem",
  component: DocumentListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DocumentListItem>;

export const Default: Story = {};
