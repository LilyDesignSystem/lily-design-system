import type { Meta, StoryObj } from "@storybook/angular";
import { NumberInput } from "./NumberInput";

const meta: Meta<NumberInput> = {
  title: "Headless/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<NumberInput>;

export const Default: Story = {};
