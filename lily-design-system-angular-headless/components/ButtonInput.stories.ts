import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonInput } from "./ButtonInput";

const meta: Meta<ButtonInput> = {
  title: "Headless/ButtonInput",
  component: ButtonInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ButtonInput>;

export const Default: Story = {};
