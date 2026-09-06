import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pagination-nav.js";
import { h } from "../stories/render.js";

const SLOT =
    '<ol><li><a href="?page=1">1</a></li><li><a href="?page=2" aria-current="page">2</a></li><li><a href="?page=3">3</a></li></ol>';

const meta: Meta = {
    title: "Navigation/PaginationNav",
    render: (args) => h("lily-pagination-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pagination"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
