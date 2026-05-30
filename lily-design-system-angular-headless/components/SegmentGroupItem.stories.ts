import type { Meta, StoryObj } from "@storybook/angular";
import { SegmentGroupItem } from "./SegmentGroupItem";

const meta: Meta<SegmentGroupItem> = {
  title: "Headless/SegmentGroupItem",
  component: SegmentGroupItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SegmentGroupItem>;

export const Default: Story = {};
