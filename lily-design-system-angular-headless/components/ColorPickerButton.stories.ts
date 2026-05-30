import type { Meta, StoryObj } from "@storybook/angular";
import { ColorPickerButton } from "./ColorPickerButton";

const meta: Meta<ColorPickerButton> = {
  title: "Headless/ColorPickerButton",
  component: ColorPickerButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColorPickerButton>;

export const Default: Story = {};
