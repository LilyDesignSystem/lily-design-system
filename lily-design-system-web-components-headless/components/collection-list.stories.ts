import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./collection-list.js";

import { h } from "../stories/render.js";

const SLOT = "<li>Open day</li><li>Career fair</li>";

const meta: Meta = {
    title: "Lists/CollectionList",
    render: (args) => h("lily-collection-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Recent articles",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
