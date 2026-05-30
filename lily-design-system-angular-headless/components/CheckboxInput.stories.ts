import type { Meta, StoryObj } from "@storybook/angular";
import { CheckboxInput } from "./CheckboxInput";

const meta: Meta<CheckboxInput> = {
  title: "Headless/CheckboxInput",
  component: CheckboxInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<CheckboxInput>;

export const Default: Story = {};
