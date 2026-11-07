import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./emoji-character-picker.js";
import { h } from "../stories/render.js";

const SLOT =
    '<button type="button" aria-label="Grinning face">\u{1F600}</button><button type="button" aria-label="Face with tears of joy">\u{1F602}</button><button type="button" aria-label="Smiling face with heart-eyes">\u{1F60D}</button>';

const meta: Meta = {
    title: "Pickers/EmojiCharacterPicker",
    render: (args) =>
        h("lily-emoji-character-picker", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Choose an emoji",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
