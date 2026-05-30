import type { Meta, StoryObj } from "@storybook/angular";
import { Command } from "./Command";

const meta: Meta<Command> = {
  title: "Headless/Command",
  component: Command,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<Command>;

export const Default: Story = {};
