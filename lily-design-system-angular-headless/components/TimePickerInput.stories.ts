import type { Meta, StoryObj } from "@storybook/angular";
import { TimePickerInput } from "./TimePickerInput";

const meta: Meta<TimePickerInput> = {
  title: "Headless/TimePickerInput",
  component: TimePickerInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TimePickerInput>;

export const Default: Story = {};
