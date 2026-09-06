import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./summary-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "Widget";

const meta: Meta = {
    title: "Lists/SummaryListItem",
    render: (args) => {
        const dl = document.createElement("dl");
        dl.className = "summary-list";
        dl.appendChild(h("lily-summary-list-item", args as Record<string, string | boolean>, SLOT));
        return dl;
    },
    args: {
        "term": "Product",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
