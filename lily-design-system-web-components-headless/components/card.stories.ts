import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./card.js";
import { h } from "../stories/render.js";

const SLOT = "Body content.";

const meta: Meta = {
    title: "Content/Card",
    render: (args) => h("lily-card", args as Record<string, string | boolean>, SLOT),
    args: {
        "heading": "Title",
        "href": "/item/1"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
