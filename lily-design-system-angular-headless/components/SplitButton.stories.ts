import type { Meta, StoryObj } from "@storybook/angular";
import { SplitButton } from "./SplitButton";

const meta: Meta<SplitButton> = {
  title: "Headless/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SplitButton>;

export const Default: Story = {};
