import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./skip-link.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Links/SkipLink",
    render: (args) => h("lily-skip-link", args as Record<string, string | boolean>),
    args: {
        "href": "#content",
        "label": "Skip to content"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
