import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./character.js";
import { h } from "../stories/render.js";

const SLOT = "✓";

const meta: Meta = {
    title: "Content/Character",
    render: (args) => h("lily-character", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Check mark",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
