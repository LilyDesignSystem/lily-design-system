import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarYearTable } from "./CalendarYearTable";

const meta: Meta<CalendarYearTable> = {
  title: "Headless/CalendarYearTable",
  component: CalendarYearTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarYearTable>;

export const Default: Story = { args: { label: "2025" } };
