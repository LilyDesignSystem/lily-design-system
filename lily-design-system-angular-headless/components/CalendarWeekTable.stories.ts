import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarWeekTable } from "./CalendarWeekTable";

const meta: Meta<CalendarWeekTable> = {
  title: "Headless/CalendarWeekTable",
  component: CalendarWeekTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarWeekTable>;

export const Default: Story = { args: { label: "Week of 6 January 2025" } };
