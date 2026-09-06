import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./dont-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "Use color alone to convey meaning";

const meta: Meta = {
    title: "Lists/DontListItem",
    render: (args) => {
        const ul = document.createElement("ul");
        ul.className = "dont-list";
        ul.appendChild(h("lily-dont-list-item", args as Record<string, string | boolean>, SLOT));
        return ul;
    },
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
