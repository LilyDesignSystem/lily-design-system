import type { Meta, StoryObj } from "@storybook/vue3-vite";
import EmojiCharacterRadioGroup from "./EmojiCharacterRadioGroup.vue";

const meta = {
    title: "Headless/EmojiCharacterRadioGroup",
    component: EmojiCharacterRadioGroup,
    tags: ["autodocs"],
} satisfies Meta<typeof EmojiCharacterRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
