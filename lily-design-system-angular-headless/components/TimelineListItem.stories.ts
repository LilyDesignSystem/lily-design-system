import type { Meta, StoryObj } from "@storybook/angular";
import { TimelineListItem } from "./TimelineListItem";

const meta: Meta<TimelineListItem> = {
  title: "Headless/TimelineListItem",
  component: TimelineListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TimelineListItem>;

export const Default: Story = {};
