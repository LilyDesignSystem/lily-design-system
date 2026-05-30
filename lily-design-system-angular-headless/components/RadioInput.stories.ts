import type { Meta, StoryObj } from "@storybook/angular";
import { RadioInput } from "./RadioInput";

const meta: Meta<RadioInput> = {
  title: "Headless/RadioInput",
  component: RadioInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RadioInput>;

export const Default: Story = {};
