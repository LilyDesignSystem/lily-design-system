import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./breadcrumb-list.js";
import "./breadcrumb-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "<lily-breadcrumb-list-item><a href=\"/\">Home</a></lily-breadcrumb-list-item><lily-breadcrumb-list-item><a href=\"/docs\">Docs</a></lily-breadcrumb-list-item><lily-breadcrumb-list-item current>This page</lily-breadcrumb-list-item>";

const meta: Meta = {
    title: "Navigation/BreadcrumbList",
    render: (args) => h("lily-breadcrumb-list", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
