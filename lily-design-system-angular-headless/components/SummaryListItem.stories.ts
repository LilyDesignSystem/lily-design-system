import type { Meta, StoryObj } from "@storybook/angular";
import { SummaryListItem } from "./SummaryListItem";

const meta: Meta<SummaryListItem> = {
  title: "Headless/SummaryListItem",
  component: SummaryListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SummaryListItem>;

export const Default: Story = {};
