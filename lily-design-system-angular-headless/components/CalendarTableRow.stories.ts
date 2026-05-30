import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableRow } from "./CalendarTableRow";

const meta: Meta<CalendarTableRow> = {
  title: "Headless/CalendarTableRow",
  component: CalendarTableRow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTableRow>;

export const Default: Story = {};
