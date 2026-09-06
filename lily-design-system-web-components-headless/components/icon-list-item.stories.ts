import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./icon-list-item.js";
import { h } from "../stories/render.js";

const SLOT = '<span slot="icon">★</span>Fast and reliable';

const meta: Meta = {
    title: "Lists/IconListItem",
    render: (args) => {
        const ul = document.createElement("ul");
        ul.className = "icon-list";
        ul.appendChild(h("lily-icon-list-item", args as Record<string, string | boolean>, SLOT));
        return ul;
    },
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
