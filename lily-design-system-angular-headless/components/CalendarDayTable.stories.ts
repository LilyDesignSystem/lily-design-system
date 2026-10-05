import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarDayTable } from "./CalendarDayTable";

const meta: Meta<CalendarDayTable> = {
  title: "Headless/CalendarDayTable",
  component: CalendarDayTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarDayTable>;

export const Default: Story = { args: { label: "Monday 6 January 2025" } };
