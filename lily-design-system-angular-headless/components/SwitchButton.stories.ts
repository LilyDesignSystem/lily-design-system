import type { Meta, StoryObj } from "@storybook/angular";
import { SwitchButton } from "./SwitchButton";

const meta: Meta<SwitchButton> = {
  title: "Headless/SwitchButton",
  component: SwitchButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SwitchButton>;

export const Default: Story = {};
