import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableBody } from "./CalendarTableBody";

const meta: Meta<CalendarTableBody> = {
  title: "Headless/CalendarTableBody",
  component: CalendarTableBody,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTableBody>;

export const Default: Story = {};
