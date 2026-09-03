import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./breadcrumb-nav.js";
import "./breadcrumb-list.js";
import "./breadcrumb-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "<lily-breadcrumb-list><lily-breadcrumb-list-item><a href=\"/\">Home</a></lily-breadcrumb-list-item><lily-breadcrumb-list-item><a href=\"/docs\">Docs</a></lily-breadcrumb-list-item><lily-breadcrumb-list-item current>This page</lily-breadcrumb-list-item></lily-breadcrumb-list>";

const meta: Meta = {
    title: "Navigation/BreadcrumbNav",
    render: (args) => h("lily-breadcrumb-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Breadcrumb"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
