import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./contents-list-item.js";
import { h } from "../stories/render.js";

const SLOT = '<a href="#introduction">Introduction</a>';

const meta: Meta = {
    title: "Lists/ContentsListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "contents-list";
        ol.appendChild(h("lily-contents-list-item", args as Record<string, string | boolean>, SLOT));
        return ol;
    },
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
