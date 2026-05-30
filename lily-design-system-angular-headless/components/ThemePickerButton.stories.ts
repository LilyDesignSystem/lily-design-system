import type { Meta, StoryObj } from "@storybook/angular";
import { ThemePickerButton } from "./ThemePickerButton";

const meta: Meta<ThemePickerButton> = {
  title: "Headless/ThemePickerButton",
  component: ThemePickerButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemePickerButton>;

export const Default: Story = {};
