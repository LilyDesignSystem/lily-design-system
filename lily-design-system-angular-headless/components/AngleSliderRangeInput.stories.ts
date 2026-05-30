import type { Meta, StoryObj } from "@storybook/angular";
import { AngleSliderRangeInput } from "./AngleSliderRangeInput";

const meta: Meta<AngleSliderRangeInput> = {
  title: "Headless/AngleSliderRangeInput",
  component: AngleSliderRangeInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<AngleSliderRangeInput>;

export const Default: Story = {};
