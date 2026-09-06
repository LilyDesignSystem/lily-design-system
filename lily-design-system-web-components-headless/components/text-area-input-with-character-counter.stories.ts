import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./text-area-input-with-character-counter.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/TextAreaInputWithCharacterCounter",
    render: (args) => h("lily-text-area-input-with-character-counter", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Feedback",
        "max-length": "500",
        "placeholder": "Tell us what you think…",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
