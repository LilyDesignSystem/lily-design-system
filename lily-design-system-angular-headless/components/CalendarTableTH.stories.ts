import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableTH } from "./CalendarTableTH";

const meta: Meta<CalendarTableTH> = {
  title: "Headless/CalendarTableTH",
  component: CalendarTableTH,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTableTH>;

export const Default: Story = {};
