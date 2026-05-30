import type { Meta, StoryObj } from "@storybook/angular";
import { RangeInput } from "./RangeInput";

const meta: Meta<RangeInput> = {
  title: "Headless/RangeInput",
  component: RangeInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RangeInput>;

export const Default: Story = {};
