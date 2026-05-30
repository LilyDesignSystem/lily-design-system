import type { Meta, StoryObj } from "@storybook/angular";
import { EmojiCharacterPicker } from "./EmojiCharacterPicker";

const meta: Meta<EmojiCharacterPicker> = {
  title: "Headless/EmojiCharacterPicker",
  component: EmojiCharacterPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<EmojiCharacterPicker>;

export const Default: Story = {};
