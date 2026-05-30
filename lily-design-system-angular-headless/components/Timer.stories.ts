import type { Meta, StoryObj } from "@storybook/angular";
import { Timer } from "./Timer";

const meta: Meta<Timer> = {
  title: "Headless/Timer",
  component: Timer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Timer>;

export const Default: Story = {};
