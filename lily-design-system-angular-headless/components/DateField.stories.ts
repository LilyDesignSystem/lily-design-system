import type { Meta, StoryObj } from "@storybook/angular";
import { DateField } from "./DateField";

const meta: Meta<DateField> = {
  title: "Headless/DateField",
  component: DateField,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DateField>;

export const Default: Story = {};
