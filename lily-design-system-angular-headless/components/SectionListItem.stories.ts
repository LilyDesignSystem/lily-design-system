import type { Meta, StoryObj } from "@storybook/angular";
import { SectionListItem } from "./SectionListItem";

const meta: Meta<SectionListItem> = {
  title: "Headless/SectionListItem",
  component: SectionListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SectionListItem>;

export const Default: Story = {};
