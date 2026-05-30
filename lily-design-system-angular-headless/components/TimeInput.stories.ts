import type { Meta, StoryObj } from "@storybook/angular";
import { TimeInput } from "./TimeInput";

const meta: Meta<TimeInput> = {
  title: "Headless/TimeInput",
  component: TimeInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TimeInput>;

export const Default: Story = {};
