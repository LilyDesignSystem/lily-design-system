import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./comment.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Great write-up, thank you for sharing this.</p>";

const meta: Meta = {
    title: "Content/Comment",
    render: (args) => h("lily-comment", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Comment by Ada Lovelace",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
