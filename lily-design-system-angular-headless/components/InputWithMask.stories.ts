import type { Meta, StoryObj } from "@storybook/angular";
import { InputWithMask } from "./InputWithMask";

const meta: Meta<InputWithMask> = {
  title: "Headless/InputWithMask",
  component: InputWithMask,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<InputWithMask>;

export const Default: Story = {};
