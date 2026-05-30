import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableHead } from "./CalendarTableHead";

const meta: Meta<CalendarTableHead> = {
  title: "Headless/CalendarTableHead",
  component: CalendarTableHead,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTableHead>;

export const Default: Story = {};
