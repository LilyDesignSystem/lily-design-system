import type { Meta, StoryObj } from "@storybook/angular";
import { DateTimeView } from "./DateTimeView";

const meta: Meta<DateTimeView> = {
  title: "Headless/DateTimeView",
  component: DateTimeView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DateTimeView>;

export const Default: Story = {};
