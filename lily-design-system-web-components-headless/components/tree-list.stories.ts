import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tree-list.js";

import { h } from "../stories/render.js";

const SLOT = '<li role="treeitem" tabindex="0">Documents</li><li role="treeitem" tabindex="-1">Photos</li><li role="treeitem" tabindex="-1">Videos</li>';

const meta: Meta = {
    title: "Lists/TreeList",
    render: (args) => h("lily-tree-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "File browser",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
