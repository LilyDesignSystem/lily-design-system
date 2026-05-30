import type { Meta, StoryObj } from "@storybook/angular";
import { DateInput } from "./DateInput";

const meta: Meta<DateInput> = {
  title: "Headless/DateInput",
  component: DateInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DateInput>;

export const Default: Story = {};
