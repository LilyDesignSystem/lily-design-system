import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarMonthTable } from "./CalendarMonthTable";

const meta: Meta<CalendarMonthTable> = {
  title: "Headless/CalendarMonthTable",
  component: CalendarMonthTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarMonthTable>;

export const Default: Story = { args: { label: "January 2025" } };
