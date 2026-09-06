import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./pagination-list.js";

import { h } from "../stories/render.js";

const SLOT = '<li><a href="/page/1">1</a></li><li><a href="/page/2" aria-current="page">2</a></li><li><a href="/page/3">3</a></li>';

const meta: Meta = {
    title: "Lists/PaginationList",
    render: (args) => h("lily-pagination-list", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
