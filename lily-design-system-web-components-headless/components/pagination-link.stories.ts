import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pagination-link.js";
import { h } from "../stories/render.js";

const SLOT = "2";

const meta: Meta = {
    title: "Links/PaginationLink",
    render: (args) => h("lily-pagination-link", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "?page=2"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
