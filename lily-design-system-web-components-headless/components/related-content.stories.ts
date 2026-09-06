import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./related-content.js";
import { h } from "../stories/render.js";

const SLOT = '<ul><li><a href="/guide-a">Guide A</a></li><li><a href="/guide-b">Guide B</a></li></ul>';

const meta: Meta = {
    title: "Navigation/RelatedContent",
    render: (args) => h("lily-related-content", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Related guidance"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
