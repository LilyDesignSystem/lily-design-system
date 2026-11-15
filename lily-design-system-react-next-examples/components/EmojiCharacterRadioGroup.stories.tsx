import type { Meta, StoryObj } from "@storybook/react-vite";
import EmojiCharacterRadioGroup from "./EmojiCharacterRadioGroup";

const meta = {
    title: "Headless/EmojiCharacterRadioGroup",
    component: EmojiCharacterRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof EmojiCharacterRadioGroup>;

export default meta;
type Story = StoryObj<typeof EmojiCharacterRadioGroup>;

export const Default: Story = {};
