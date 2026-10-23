import type { Meta, StoryObj } from "@storybook/angular";
import { WheelPicker } from "./WheelPicker";

const meta: Meta<WheelPicker> = {
  title: "Headless/WheelPicker",
  component: WheelPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<WheelPicker>;

export const Default: Story = {
  args: {
    label: "Month",
    value: "2",
    options: [{ value: "1", label: "January" }, { value: "2", label: "February" }, { value: "3", label: "March" }],
  },
};
