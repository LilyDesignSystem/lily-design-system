import type { Meta, StoryObj } from "@storybook/angular";
import { ThemeSelectButton } from "./ThemeSelectButton";

const meta: Meta<ThemeSelectButton> = {
  title: "Headless/ThemeSelectButton",
  component: ThemeSelectButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ThemeSelectButton>;

export const Default: Story = {};
