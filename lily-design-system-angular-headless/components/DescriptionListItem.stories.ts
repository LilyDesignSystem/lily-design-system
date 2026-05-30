import type { Meta, StoryObj } from "@storybook/angular";
import { DescriptionListItem } from "./DescriptionListItem";

const meta: Meta<DescriptionListItem> = {
  title: "Headless/DescriptionListItem",
  component: DescriptionListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DescriptionListItem>;

export const Default: Story = {};
