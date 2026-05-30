import type { Meta, StoryObj } from "@storybook/angular";
import { ColorPicker } from "./ColorPicker";

const meta: Meta<ColorPicker> = {
  title: "Headless/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ColorPicker>;

export const Default: Story = {};
