import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tree-menu.js";
import { h } from "../stories/render.js";

const SLOT = '<li role="treeitem" tabindex="0" aria-expanded="true">File<ul role="group"><li role="treeitem" tabindex="-1">New</li><li role="treeitem" tabindex="-1">Open</li><li role="treeitem" tabindex="-1">Save</li></ul></li><li role="treeitem" tabindex="-1" aria-expanded="false">Edit</li><li role="treeitem" tabindex="-1">Help</li>';

const meta: Meta = {
    title: "Navigation/TreeMenu",
    render: (args) => h("lily-tree-menu", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "File actions"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
