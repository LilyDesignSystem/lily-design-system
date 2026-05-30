import type { Meta, StoryObj } from "@storybook/angular";
import { DateTimeNowInput } from "./DateTimeNowInput";

const meta: Meta<DateTimeNowInput> = {
  title: "Headless/DateTimeNowInput",
  component: DateTimeNowInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DateTimeNowInput>;

export const Default: Story = {};
