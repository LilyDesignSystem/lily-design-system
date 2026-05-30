import type { Meta, StoryObj } from "@storybook/angular";
import { ButtonGroup } from "./ButtonGroup";

const meta: Meta<ButtonGroup> = {
  title: "Headless/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ButtonGroup>;

export const Default: Story = {};
