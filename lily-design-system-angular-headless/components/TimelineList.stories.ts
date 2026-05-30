import type { Meta, StoryObj } from "@storybook/angular";
import { TimelineList } from "./TimelineList";

const meta: Meta<TimelineList> = {
  title: "Headless/TimelineList",
  component: TimelineList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TimelineList>;

export const Default: Story = {};
