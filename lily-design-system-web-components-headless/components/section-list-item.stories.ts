import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./section-list-item.js";
import { h } from "../stories/render.js";

const SLOT = '<a href="/section/1">Overview</a>';

const meta: Meta = {
    title: "Lists/SectionListItem",
    render: (args) => {
        const ul = document.createElement("ul");
        ul.className = "section-list";
        ul.appendChild(h("lily-section-list-item", args as Record<string, string | boolean>, SLOT));
        return ul;
    },
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
