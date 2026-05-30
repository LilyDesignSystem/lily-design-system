import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTable } from "./CalendarTable";

const meta: Meta<CalendarTable> = {
  title: "Headless/CalendarTable",
  component: CalendarTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTable>;

export const Default: Story = {};
