import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./article-layout.js";
import { h } from "../stories/render.js";

const SLOT = "<h2>Feature story</h2><p>Article content goes here.</p>";

const meta: Meta = {
    title: "Navigation/ArticleLayout",
    render: (args) => h("lily-article-layout", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Feature story"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
