import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./emoji.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Content/Emoji",
    render: (args) => h("lily-emoji", args as Record<string, string | boolean>),
    args: {
        "emoji": "👍",
        "label": "Thumbs up",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
