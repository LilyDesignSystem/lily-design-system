import type { Meta, StoryObj } from "@storybook/angular";
import { ColorInput } from "./ColorInput";

const meta: Meta<ColorInput> = {
  title: "Headless/ColorInput",
  component: ColorInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColorInput>;

export const Default: Story = {};
