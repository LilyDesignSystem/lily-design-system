import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./breadcrumb-link.js";
import { h } from "../stories/render.js";

const SLOT = "Products";

const meta: Meta = {
    title: "Links/BreadcrumbLink",
    render: (args) => h("lily-breadcrumb-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "/products"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
