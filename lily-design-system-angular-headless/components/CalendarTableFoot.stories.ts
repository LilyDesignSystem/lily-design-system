import type { Meta, StoryObj } from "@storybook/angular";
import { CalendarTableFoot } from "./CalendarTableFoot";

const meta: Meta<CalendarTableFoot> = {
  title: "Headless/CalendarTableFoot",
  component: CalendarTableFoot,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CalendarTableFoot>;

export const Default: Story = {};
