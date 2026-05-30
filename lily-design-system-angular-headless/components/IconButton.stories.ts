import type { Meta, StoryObj } from "@storybook/angular";
import { IconButton } from "./IconButton";

const meta: Meta<IconButton> = {
  title: "Headless/IconButton",
  component: IconButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<IconButton>;

export const Default: Story = {};
