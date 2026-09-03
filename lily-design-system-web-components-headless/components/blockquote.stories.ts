import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./blockquote.js";
import { h } from "../stories/render.js";

const SLOT = "The Analytical Engine has no pretensions whatever to originate anything.";

const meta: Meta = {
    title: "Content/Blockquote",
    render: (args) => h("lily-blockquote", args as Record<string, string | boolean>, SLOT),
    args: {
        "citation-text": "Ada Lovelace"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
