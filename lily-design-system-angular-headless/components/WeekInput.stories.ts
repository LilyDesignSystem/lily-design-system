import type { Meta, StoryObj } from "@storybook/angular";
import { WeekInput } from "./WeekInput";

const meta: Meta<WeekInput> = {
  title: "Headless/WeekInput",
  component: WeekInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<WeekInput>;

export const Default: Story = {};
