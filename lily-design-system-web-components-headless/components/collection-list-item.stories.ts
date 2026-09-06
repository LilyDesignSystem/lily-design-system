import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./collection-list-item.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Lists/CollectionListItem",
    render: (args) => {
        const ul = document.createElement("ul");
        ul.className = "collection-list";
        ul.appendChild(h("lily-collection-list-item", args as Record<string, string | boolean>));
        return ul;
    },
    args: {
        "heading": "Getting started with Lily",
        "href": "/articles/1",
        "meta": "January 1, 2026",
        "description": "A short summary of the article.",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
