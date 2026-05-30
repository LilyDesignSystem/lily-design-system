import type { Meta, StoryObj } from "@storybook/angular";
import { TimerButton } from "./TimerButton";

const meta: Meta<TimerButton> = {
  title: "Headless/TimerButton",
  component: TimerButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<TimerButton>;

export const Default: Story = {};
