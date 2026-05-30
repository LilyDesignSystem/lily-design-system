import type { Meta, StoryObj } from "@storybook/angular";
import { ClipboardCopyButton } from "./ClipboardCopyButton";

const meta: Meta<ClipboardCopyButton> = {
  title: "Headless/ClipboardCopyButton",
  component: ClipboardCopyButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<ClipboardCopyButton>;

export const Default: Story = {};
