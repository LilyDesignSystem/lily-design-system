import type { Meta, StoryObj } from "@storybook/angular";
import { SliderButton } from "./SliderButton";

const meta: Meta<SliderButton> = {
  title: "Headless/SliderButton",
  component: SliderButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SliderButton>;

export const Default: Story = {};
