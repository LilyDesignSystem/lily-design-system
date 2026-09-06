import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./byline.js";
import { h } from "../stories/render.js";

const SLOT =
    'By <a rel="author" href="/authors/jane-doe">Jane Doe</a> ' +
    '<time datetime="2026-09-06">6 September 2026</time>';

const meta: Meta = {
    title: "Content/Byline",
    render: (args) => h("lily-byline", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Article byline",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
