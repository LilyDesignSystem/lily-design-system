import type { Meta, StoryObj } from "@storybook/angular";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<RadioGroup> = {
  title: "Headless/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<RadioGroup>;

export const Default: Story = {};
