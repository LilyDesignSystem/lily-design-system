import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pagination-list-item.js";
import { h } from "../stories/render.js";

const SLOT = '<a href="/page/2" aria-current="page">2</a>';

const meta: Meta = {
    title: "Lists/PaginationListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "pagination-list";
        ol.appendChild(h("lily-pagination-list-item", args as Record<string, string | boolean>, SLOT));
        return ol;
    },
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
