import type { Meta, StoryObj } from "@storybook/angular";
import { ToggleButton } from "./ToggleButton";

const meta: Meta<ToggleButton> = {
  title: "Headless/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ToggleButton>;

export const Default: Story = {};
