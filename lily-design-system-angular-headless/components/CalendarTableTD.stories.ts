import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableTD } from "./CalendarTableTD";

const meta: Meta<CalendarTableTD> = {
  title: "Headless/CalendarTableTD",
  component: CalendarTableTD,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTableTD>;

export const Default: Story = {};
