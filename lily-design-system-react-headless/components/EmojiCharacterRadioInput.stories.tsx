import type { Meta, StoryObj } from "@storybook/react-vite";
import EmojiCharacterRadioInput from "./EmojiCharacterRadioInput";

const meta = {
    title: "Headless/EmojiCharacterRadioInput",
    component: EmojiCharacterRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof EmojiCharacterRadioInput>;

export default meta;
type Story = StoryObj<typeof EmojiCharacterRadioInput>;

export const Default: Story = {};
