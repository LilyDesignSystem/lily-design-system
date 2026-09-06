import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./character-counter.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/CharacterCounter",
    render: (args) => h("lily-character-counter", args as Record<string, string | boolean>, SLOT),
    args: {
        "count": "42",
        "max": "140",
        "label": "Characters remaining",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
