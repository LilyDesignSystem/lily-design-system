import type { Meta, StoryObj } from "@storybook/angular";
import { Slider } from "./Slider";

const meta: Meta<Slider> = {
  title: "Headless/Slider",
  component: Slider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Slider>;

export const Default: Story = {};
