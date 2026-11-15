import type { Meta, StoryObj } from "@storybook/vue3-vite";
import EmojiCharacterRadioInput from "./EmojiCharacterRadioInput.vue";

const meta = {
    title: "Headless/EmojiCharacterRadioInput",
    component: EmojiCharacterRadioInput,
    tags: ["autodocs"],
} satisfies Meta<typeof EmojiCharacterRadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
