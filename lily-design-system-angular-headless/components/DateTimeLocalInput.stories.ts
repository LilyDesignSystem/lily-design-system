import type { Meta, StoryObj } from "@storybook/angular";
import { DateTimeLocalInput } from "./DateTimeLocalInput";

const meta: Meta<DateTimeLocalInput> = {
  title: "Headless/DateTimeLocalInput",
  component: DateTimeLocalInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<DateTimeLocalInput>;

export const Default: Story = {};
