import type { Meta, StoryObj } from "@storybook/angular";
import { KbdShortcut } from "./KbdShortcut";

const meta: Meta<KbdShortcut> = {
  title: "Headless/KbdShortcut",
  component: KbdShortcut,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<KbdShortcut>;

export const Default: Story = {
  args: { keys: ["Ctrl", "K"] },
};
