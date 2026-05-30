import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarRangePicker } from "./CalendarRangePicker";

const meta: Meta<CalendarRangePicker> = {
  title: "Headless/CalendarRangePicker",
  component: CalendarRangePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarRangePicker>;

export const Default: Story = {};
