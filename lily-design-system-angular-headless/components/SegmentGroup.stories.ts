import type { Meta, StoryObj } from "@storybook/angular";
import { SegmentGroup } from "./SegmentGroup";

const meta: Meta<SegmentGroup> = {
  title: "Headless/SegmentGroup",
  component: SegmentGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SegmentGroup>;

export const Default: Story = {};
