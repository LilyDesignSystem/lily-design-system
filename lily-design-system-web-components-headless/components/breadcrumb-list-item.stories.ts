import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./breadcrumb-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "This page";

const meta: Meta = {
    title: "Navigation/BreadcrumbListItem",
    render: (args) => {
        const ol = document.createElement("ol");
        ol.className = "breadcrumb-list";
        ol.appendChild(h("lily-breadcrumb-list-item", args as Record<string, string | boolean>, SLOT));
        return ol;
    },
    args: {
        "current": true
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
