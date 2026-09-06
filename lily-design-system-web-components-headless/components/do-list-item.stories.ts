import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./do-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "Use descriptive alt text for images";

const meta: Meta = {
    title: "Lists/DoListItem",
    render: (args) => {
        const ul = document.createElement("ul");
        ul.className = "do-list";
        ul.appendChild(h("lily-do-list-item", args as Record<string, string | boolean>, SLOT));
        return ul;
    },
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
