import type { Meta, StoryObj } from "@storybook/angular";
import { DateRange } from "./DateRange";

const meta: Meta<DateRange> = {
  title: "Headless/DateRange",
  component: DateRange,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DateRange>;

export const Default: Story = {};
